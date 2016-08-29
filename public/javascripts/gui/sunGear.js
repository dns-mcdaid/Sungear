"use strict";

const SortedSet = require('collections/sorted-set');

const DataReader = require('../data/dataReader');

const GeneEvent = require('../genes/geneEvent');
const MultiSelectable = require('../genes/multiSelectable');

const AnchorDisplay = require('./sungear/anchorDisplay');
const Comp = require('./sungear/comp');
const Icons = require('./sungear/icons');
const Stats = require('./sungear/stats');
const VesselDisplay = require('./sungear/vesselDisplay');

/**
 * Interactive generalization of a Venn diagram to many dimensions.
 */
function SunGear(genes, thresh, statsF) {
    if (typeof statsF === 'undefined') {
        statsF = thresh;
        thresh = NaN;
    }
    // Container for GUI buttons.
    this.visuals = [];

    this.vRadMax = 0.1;
    this.minRad = [ 0.0, 0.005, 0.010, 0.015, 0.020 ];

    this.genes = genes;
    this.thresh = thresh;
    this.stats = new Stats(genes, this);
    this.statsF = statsF;
    this.moon = null;
    this.orderedVessels = [];
    this.vSort = new Comp.VesselSelSize();
    this.polarPlot = false;
    this.showArrows = true;
    this.minRadIdx = 0;

    this.prevB = new Icons.ArrowIcon(2, 4, false);
    this.selB = new Icons.EllipseIcon(3, false);
    this.nextB = new Icons.ArrowIcon(0, 4, false);
    this.statsB = new Icons.StatsIcon();
    this.showArrowB = new Icons.ShowArrowIcon(true);
    this.minSizeB = new Icons.VesselMinIcon(this.minRad.length, 2, 0);
    
    this.WIDTH = document.getElementById('sungearGui').offsetWidth;
    this.HEIGHT = document.getElementById('sungearGui').offsetHeight;

    var prevBParams = [ 10, this.HEIGHT-30 ];
    this.visuals.push(new Visual(this.prevB, prevBParams, this.prevBFunction.bind(this)));
    var selBParams = [ 35.5, this.HEIGHT-22 ];
    this.visuals.push(new Visual(this.selB, selBParams, this.selBFunction.bind(this)));
    var nextBParams = [ 45, this.HEIGHT-30 ];
    this.visuals.push(new Visual(this.nextB, nextBParams, this.nextBFunction.bind(this)));
    var statsBParams = [ 13, this.HEIGHT-108 ];
    this.visuals.push(new Visual(this.statsB, statsBParams, this.statsBFunction.bind(this)));
    var showArrowBParams = [ 20, this.HEIGHT-50 ];
    this.visuals.push(new Visual(this.showArrowB, showArrowBParams, this.showArrowBFunction.bind(this)));
    var minSizeBParams = [ 20, this.HEIGHT-75 ];
    this.visuals.push(new Visual(this.minSizeB, minSizeBParams, this.minSizeBFunction.bind(this)));

    this.exterior = {
        x : -(SunGear.R_CIRCLE),
        y : -(SunGear.R_CIRCLE),
        w : 2*SunGear.R_CIRCLE,
        h : 2*SunGear.R_CIRCLE
    };

    this.setShowArrows(this.showArrows);

    this.highCnt = 0;
    this.lastAnchor = null;
    this.lastVessel = null;

    this.genes.addGeneListener(this);
    this.genes.addMultiSelect(this);
    this.anchors = [];
    this.vessels = [];
    this.goTerm = null;
    this.multi = false;
    this.relax = true;
}

SunGear.R_OUTER = 1.2;
SunGear.R_CIRCLE = 1.0;
SunGear.C_PLAIN = "#F3EFE0";
SunGear.C_HIGHLIGHT = "#3399FF";
SunGear.C_SELECT = "#9A3334";
SunGear.C_BACKGROUND = "#111111";
SunGear.C_SELECT_ALT = "#217C7E";

SunGear.prototype = {
    constructor : SunGear,
    cleanup : function() {
        for (let i = 0; i < this.anchors.length; i++) {
            this.anchors[i].cleanup();
        }
        this.anchors = null;
        for (let i = 0; i < this.vessels.length; i++) {
            this.vessels[i].cleanup();
        }
        this.vessels = null;
        this.genes = null;
        this.lastAnchor = null;
        this.lastVessel = null;
    },
    /**
     * @returns {VesselDisplay[]}
     */
    getVessels : function() {
        return this.vessels;
    },
    /** @function makeButton was removed */
    /**
     * @param n {int}
     */
    order : function(n) {
        if (n != -1) {
            try {
                let v = this.orderedVessels[n];
                this.lastVessel = v;
                this.highlightVessel(v);
                this.updateCount();
            } catch (e) {
                console.log(e);
            }
        }
    },
    /**
     * @param src {DataSource}
     */
    set : function(src) {
        // make the displayable components
        let t = this.thresh;
        console.log("thresh: " + this.thresh);
        if(isNaN(t)) {
            console.log("check");
            t = 1.0;

            let att = src.getAttributes().get("threshold");
            if (att !== null) {
                t = att;
            }
        }
        console.log("t: " + t);
        let v = [];
        DataReader.setThreshold(t, this.genes.getGenesSet(), src.getReader().anchors, v);
        this.makeDisplay(src.getReader().anchors, v);
        console.log("Anchors: " + this.anchors.length + " vessels: " + this.vessels.length);
    },
    /**
     * @param t {GoTerm}
     */
    setGo : function(t) {
        this.goTerm = t;
    },
    /**
     * @param b {boolean}
     */
    setRelax : function(b) {
        this.relax = b;
        this.positionVessels();
    },
    /**
     * @returns {boolean}
     */
    getRelax : function() {
        return this.relax;
    },
    /**
     * @param n {int}
     */
    setMinVesselSizeIdx : function(n) {
        this.minRadIdx = n;
        this.minSizeB.step = n;
        if (this.vessels !== null) {
            for (let i = 0; i < this.vessels.length; i++) {
                this.vessels[i].setRadMin(this.minRad[n]);
                this.positionVessels();
            }
        }
    },
    /**
     * @param b {boolean}
     */
    setShowArrows : function(b) {
        this.showArrows = b;
        if (this.vessels !== null && typeof this.vessels !== 'undefined') {
            for (let i = 0; i < this.vessels.length; i++) {
                this.vessels[i].setShowArrows(b);
                this.positionVessels();
            }
        }
    },
    showStats : function() {
        $('#statsF').modal('show');
    },
    /**
     * @param g {Gene}
     * @returns {Array} of Terms
     */
    getGeneTerms : function(g) {
        if (this.goTerm === null || this.goTerm.get() === null) {
            return [];
        } else {
            return this.goTerm.get().getCurrentTerms(g);
        }
    },
    /**
     * @returns {javascript.util.TreeSet}
     */
    getAssocGenes : function() {
        return (this.goTerm === null || this.goTerm.get() === null) ? new SortedSet() : this.goTerm.get().assocGenes;
    },
    /**
     * @param c {Collection<Gene>}
     */
    getTerms : function(c) {
        const t = new SortedSet();
        for (let it = 0; it < c.length; it++) {
            let toAdd = this.getGeneTerms(c[it]);
            for (let i = 0; i < toAdd.length; i++) {
                t.push(toAdd[i]);
            }
        }
        return t;
    },
    /**
     *
     * @param maxVessels {int}
     * @param minScore {int}
     * @param method {int}
     */
    getCool : function(maxVessels, minScore, method) {
        console.log("method: " + method);
        // intermediate storage for vessel cool term
        /**
         * @param score {int}
         * @param count {int}
         * @return {Comp.CoolVessel[]}
         * @constructor
         */
        function CoolTerm(score, count) {
            this.score = score;
            this.count = count;
        }
        const cool = new SortedSet();
        let debug = true; // TODO: Change this in production
        let ag = this.getAssocGenes();
        for (let i = 0; i < this.vessels.length; i++) {
            if (this.vessels[i].getActiveCount() == 0) {
                continue;
            }
            if (debug) {
                console.log("sz: " + this.vessels[i].activeGenes.size());
            }
            const tt = this.getTerms(this.vessels[i].activeGenes);
            const ct = [];
            for (let it = 0; it < tt.length; it++) {
                const t = tt[it];
                const cnt = new SortedSet();
                const cnt2 = new SortedSet();
                const preCnt = t.getAllGenes().toArray();
                const preCnt2 = this.vessels[i].activeGenes.toArray();
                for (let j = 0; j < preCnt.length; j++) {
                    if (preCnt2.indexOf(preCnt[j]) > -1) {
                        cnt.add(preCnt[j]);
                    }
                }
                for (let j = 0; j < preCnt2.length; j++) {
                    if (ag.contains(preCnt2[j])) {
                        cnt2.add(preCnt2[j]);
                    }
                }
                let z = t.calcScore(cnt.size(), cnt2.size());
                if (z >= minScore) {
                    ct.push(new CoolTerm(z, cnt.size()));
                }
            }
            // per-method stuff - calculate score from cool terms
            let c;
            switch (method) {
                case 1:
                    // threshhold and multiply
                    if (debug) {
                        console.log("\tct: " + ct.length);
                    }
                    var score = 0;
                    for (let it = 0; it < ct.length; it++) {
                        const t = ct[it];
                        score += t.score * t.count;
                    }
                    score /= this.vessels[i].activeGenes.length;
                    if (debug) {
                        console.log("\tscore: " + score);
                    }
                    c = new Comp.CoolVessel(this.vessels[i], score, this.vessels[i].activeGenes.length);
                    break;
                default:
                    // threshhold only
                    if (debug) {
                        console.log("\tct: " + ct.length);
                    }
                    var acnt = 0;
                    for (let it = 0; it < ct.length; it++) {
                        const t = ct[it];
                        if (t.count >= 2) {
                            acnt++;
                        }
                    }
                    if (debug) {
                        console.log("\tacnt: " + acnt);
                    }
                    c = Comp.CoolVessel(vessels[i], acnt, vessels[i].activeGenes.size());
                    break;
            }
            // more generic processing - update cool list if necessary
            let coolArray = cool.toArray();
            let last = coolArray[coolArray.length-1];
            if (cool.length < maxVessels || c.compareTo(last) < 0) {
                if (debug) {
                    console.log("\tadded");
                }
                cool.push(c);
                while(cool.length > maxVessels) {
                    coolArray = cool.toArray();
                    last = coolArray[coolArray.length-1];
                    cool.remove(last);
                }
            }
            if (debug) {
                console.log();
            }
        }
        if (debug) {
            console.log("Final scores:");
            let coolArray = cool.toArray();
            for (let it = 0; it < coolArray.length; it++) {
                console.log(coolArray[it].score);
            }
        }
        return (cool.toArray());
    },
    /**
     * @param maxVessels {int}
     * @param minScore {int}
     * @return {Comp.CoolVessel[]}
     */
    getCoolThresh : function(maxVessels, minScore) {
        // TODO: Ensure this works.
        console.log("Attempting to sort Vessels by ActSize. Remove me later!");
        this.vessels.sort(Comp.VesselActSize);
        let cool = new SortedSet();
        let last;
        for (let i = 0; i < this.vessels.length; i++) {
            const s = this.getTerms(this.vessels[i].activeGenes);
            if (s.size() > 2) {
                let pt = [];    // terms potentially meeting cool criteria (score >= minScore)
                for (let it = 0; it < s.length; it++) {
                    let t = s[it];
                    if (t.getScore() >= minScore) {
                        pt.push(t);
                    }
                }
                if (cool.size() > 0) {
                    let coolArray = cool.toArray();
                    last = coolArray[coolArray.length-1];
                } else {
                    last = new Comp.CoolVessel(null, 0, null);
                }
                if ((cool.size() < maxVessels && pt.size() > 0) || (cool.size() == maxVessels && pt.size() >= last.score)) {
                    let acnt = 0;   // number of terms actually meeting cool criteria (pcnt genes with gene count >= 2)
                    let tot = 0;    // total number of genes across all intersections
                    for (let it = 0; it < pt.length; it++) {
                        let t = pt[it];
                        let gs = new SortedSet();
                        let allGenes = t.getAllGenes();
                        let geneActive = this.genes.getActiveSet().toArray();
                        let vesselActive = this.vessels[i].activeGenes.toArray();
                        for (let j = 0; j < allGenes.length; j++) {
                            if (geneActive.indexOf(allGenes[j]) > -1 && vesselActive.indexOf(allGenes[j]) > -1) {
                                gs.push(allGenes[j]);
                            }
                        }
                        if (gs.length >= 2) {
                            acnt++;
                            tot += gs.length;
                        }
                    }
                    if (acnt > 0) {
                        cool.add(new Comp.CoolVessel(this.vessels[i], acnt, tot));
                        while (cool.size() > maxVessels) {
                            // TODO: Ensure this works.
                            let coolArray = cool.toArray();
                            last = coolArray[coolArray.length-1];
                            cool.remove(last);
                        }
                    }
                }
            }
        }
        return cool.toArray();
    },
    /**
     * @param anch {Array} of Anchors
     * @param ves {Array} of Vessels
     */
    makeDisplay : function(anch, ves) {
        // find vessel min/max vals
        this.vMax = 0;
        this.vMin = Number.MAX_VALUE;
        for (let i = 0; i < ves.length; i++) {
            let v = ves[i];
            this.vMax = Math.max(this.vMax, v.getFullCount());
            this.vMin = Math.max(this.vMin, v.getFullCount());
        }
        // init anchor display components
        this.anchors = [];
        const anchorConv = {};
        let t = 3.0 * Math.PI / 2.0;
        let dt = 2.0 * Math.PI / anch.length;
        for (let i = 0; i < anch.length; i++) {
            let a = anch[i];
            this.anchors[i] = new AnchorDisplay(a);
            anchorConv[a] = this.anchors[i];
            this.anchors[i].setScale(Math.min(1, 8.0/anch.length));
            this.anchors[i].setAngle(t);
            t = (t+dt) % (2.0 * Math.PI);
        }
        // init outer gear shape and inner radius size
        if (this.anchors.length < 3) {
            this.rad_inner = 1 - this.vRadMax;
            this.exterior = {
                x : -(SunGear.R_CIRCLE),
                y : -(SunGear.R_CIRCLE),
                w : 2*SunGear.R_CIRCLE,
                h : 2*SunGear.R_CIRCLE
            };
        } else {
            this.rad_inner = 1 - this.vRadMax * (1 + 3.0/this.anchors.length);
            let x = [];
            let y = [];
            for (let i = 0; i < this.anchors.length; i++) {
                var t1 = this.anchors[i].getAngle();
                x.push(SunGear.R_CIRCLE*Math.cos(t1));
                y.push(SunGear.R_CIRCLE*Math.sin(t1));
            }
            this.exterior = {
                x : x,
                y : y,
                w : null,
                h : null
            };
        }
        // init vessel display components
        this.vessels = [];
        const vesselConv = {};
        for (let i = 0; i < ves.length; i++) {
            let v = ves[i];
            this.vessels[i] = new VesselDisplay(v);
            vesselConv[v] = this.vessels[i];
            this.vessels[i].setRadMin(this.minRad[this.minRadIdx]);
            this.vessels[i].setShowArrows(this.showArrows);
            console.log("Vessel #" + i);
            console.log()
            this.vessels[i].setAnchors(anchorConv);
            this.vessels[i].setMax(this.vMax);
            this.vessels[i].initActive();
            this.vessels[i].makeShape(this.rad_inner);
            if (this.vessels[i].anchor.length == 0) {
                this.moon = this.vessels[i];
            }
        }
        // offset centers of overlapping vessels
        this.positionVessels();
    },
    positionVessels : function() {
        if (this.polarPlot) {
            this.positionVesselsPolar();
        } else {
            this.positionVesselsCartesian();
        }
    },
    positionVesselsPolar : function() {
        for (let i = 0; i < this.vessels.length; i++) {
            if (this.vessels[i].anchor.length > 0) {

                const r = this.rad_inner * (1.0 - (this.vessels[i].anchor.length - 1.0)/(this.anchors.length-1.0));
                const x = this.vessels[i].getStart().x;
                const y = this.vessels[i].getStart().y;
                const d = Math.sqrt(x*x + y*y);
                const t = (d < .001) ? this.vessels[i].anchor[0].getAngle() : Math.atan2(y, x);

                this.vessels[i].getCenter().x = r * Math.cos(t);
                this.vessels[i].getCenter().y = r * Math.sin(t);
                this.vessels[i].setRadMax(.05);
                this.vessels[i].updateCenter();
            }
        }
    },
    positionVesselsCartesian : function() {
        for (let i = 0; i < this.vessels.length; i++) {
            this.vessels[i].getCenter().x = this.vessels[i].getStart().x;
            this.vessels[i].getCenter().y = this.vessels[i].getStart().y;
            this.vessels[i].updateCenter();
        }
        if (this.relax) {
            console.log("relax bro.");
            this.adjustCenters(.005);
            this.relaxCenters();
        } else {
            console.log("never relax.");
            this.adjustCenters(1.0);
        }
    },
    relaxCenters : function() {
        let maxIter = 200;
        let eta = 1.0;
        let decay = 0.01;
        let energy = this.vessels.length;
        let cnt = 0;

        do {
            const e = this.relaxStep(eta);
            energy = e;
            eta *= (1-decay);
            cnt++;
        } while (cnt < 10 || (energy*eta > 5e-5*this.vessels.length && cnt < maxIter));

        for (let i = 0; i < this.vessels.length; i++) {
            this.vessels[i].updateCenter();
        }
    },
    /**
     * @param eta {double}
     * @return {Number} double
     */
    relaxStep : function(eta) {
        // scaling factor to give extra space for vessels (and arrows)
        let sf = 1.5;
        // random factor added to or substracted from movement
        let rf = 0.3;
        for (let i = 0; i < this.vessels.length; i++) {
            let v = this.vessels[i];
            if (v.anchor.length == 0 || v.getActiveCount() == 0) {
                continue;
            }
            // weak attraction to center point
            v.dx = 0.02 * (v.getStart().x - v.getCenter().x);
            v.dy = 0.02 * (v.getStart().y - v.getCenter().y);
            // strong repulsion from border
            const md = Math.sqrt(v.getCenter().x*v.getCenter().x + v.getCenter().y*v.getCenter().y);
            if (md > 1) {
                v.dx -= (md-1) * v.getCenter().x;
                v.dy -= (md-1) * v.getCenter().y;
            }
        }
        // overlapping vessels repel
        for (let i = 0; i < this.vessels.length; i++) {
            let v1 = this.vessels[i];
            if (v1.getActiveCount() == 0) {
                continue;
            }
            for (let j = i+1; j < this.vessels.length; j++) {
                let v2 = this.vessels[j];
                if (v2.getActiveCount() == 0) {
                    continue;
                }
                // x & y distance b/t points, and total radius
                let ax = v1.getCenter().x - v2.getCenter().x;
                let ay = v1.getCenter().y - v2.getCenter().y;
                let ar = sf * (v1.getRadOuter() + v2.getRadOuter());
                // do vessels overlap?
                if (ax*ax + ay*ay < ar*ar) {
                    // how much the overlap is
                    let adist = Math.sqrt(ax*ax + ay*ay);
                    let dr = ar - adist;
                    let dx = 0;
                    let dy = 0;
                    if (adist < 1e-12) {
                        // total overlap = vessel centers are the same
                        // TODO: Make sure this works the same way.
                        let t = Math.random() * 2 * Math.PI;
                        dx = sf * dr * Math.cos(t);
                        dy = sf * dr * Math.sin(t);
                    } else {
                        dx = 0.75 * (dr/adist) * (v2.getCenter().x - v1.getCenter().x);
                        dy = 0.75 * (dr/adist) * (v2.getCenter().y - v1.getCenter().y);
                    }
                    let iv = this.vessels[i].anchor.length;
                    let jv = this.vessels[i].anchor.length;
                    v1.dx -= (jv/(iv+jv)) * dx * (1 + 2*rf*Math.random()-rf);
                    v1.dy -= (jv/(iv+jv)) * dy * (1 + 2*rf*Math.random()-rf);
                    v2.dx += (jv/(iv+jv)) * dx * (1 + 2*rf*Math.random()-rf);
                    v2.dy += (iv/(iv+jv)) * dy * (1 + 2*rf*Math.random()-rf);
                }
            }
        }
        let e = 0;
        for (let i = 0; i < this.vessels.length; i++) {
            const v = this.vessels[i];
            if (v.getActiveCount() != 0) {
                v.getCenter().x += eta * v.dx;
                v.getCenter().y += eta * v.dy;
                e += Math.sqrt(v.dx*v.dx + v.dy*v.dy);
            }
        }
        return e;
    },
    adjustCenters : function(scl) {
        // split vessels into groups by location
        let l = [];
        for (let i = 0; i < this.vessels.length; i++) {
            if (this.vessels[i].getActiveCount() == 0) {
                continue;
            }
            let p = this.vessels[i].getCenter();
            let added = false;
            for (let j = 0; j < l.length && !added; j++) {
                let v = l[j];
                // TODO: Get distance.
                let distX = p.x - v[0].getCenter().x;
                let distY = p.y - v[0].getCenter().y;
                let dist = Math.sqrt((distX*distX) + (distY*distY));
                if (dist < .0001) {
                    v.push(this.vessels[i]);
                    added = true;
                }
            }
            if (!added) {
                let v = [];
                v.push(this.vessels[i]);
                l.push(v);
            }
        }

        // offset centers of same-centered vessels
        for (let i = 0; i < l.length; i++) {
            let v = l[i];
            if (v.length == 1) {
                continue;
            }
            for (let k = 0; k < v.length; k++) {
                const curr = v[k];
                const p = curr.getCenter();
                curr.setCenter(p.x + scl*curr.getRadOuter() * Math.sqrt(v.length) * Math.cos(Math.PI*2*k/v.length),  p.y + scl*curr.getRadOuter() * Math.sqrt(v.length) * Math.sin(Math.PI*2*k/v.length), this.rad_inner);
                curr.makeShape(this.rad_inner);
            }
        }
    },
    /**
     * @param p {Point}
     * @returns {boolean}
     */
    isInGear : function(p) {
        try {
            // TODO: Find a way to check for this.
        } catch(nt) {
            console.log(nt);
            return false;
        }
    },
    /**
     * Finds the anchor at a point in sungear coordinates.
     * @param p {Point} in sungear coordinates
     * @return {AnchorDisplay} at the given location, or null if none
     */
    getAnchor : function(p) {
        for (let i = 0; i < this.anchors.length; i++) {
            if (this.anchors[i].contains(p)) {
                return this.anchors[i];
            }
        }
        return null;
    },
    /**
     * Finds the vessel at a point in sungear coordinates.
     * @param p {Point} in sungear coordinates
     * @return {VesselDisplay} at the given location, or null if none
     */
    getVessel : function(p) {
        for (let i = 0; i < this.vessels.length; i++) {
            if (this.vessels[i].contains(p)) {
                return this.vessels[i];
            }
        }
    },
    /**
     * Updates the selected state of anchors/vessels based on mouse location.
     * Changes appearance only, not selected gene sets.
     * @param p5 {p5} for processing the mouseEvent
     */
    checkSelect : function(p5) {
        const p = {
            x : p5.mouseX,
            y : p5.mouseY
        };
        let chg = false;
        const a = this.getAnchor(p);
        for (let i = 0; i < this.anchors.length; i++) {
            chg = chg || (this.anchors[i].getSelect() != (this.anchors[i] == a));
            this.anchors[i].setSelect(this.anchors[i] == a);
        }
        const v = this.getVessel(p);
        for (let i = 0; i < this.vessels.length; i++) {
            chg = chg || (this.vessels[i].getSelect() != (this.vessels[i] == v));
            this.vessels[i].setSelect(this.vessels[i] == v);
        }
    },
    setMulti : function(b) {
        this.multi = b;
        if (!b) {
            for (let i = 0; i < this.vessels.length; i++) {
                this.vessels[i].setSelect(false);
            }
            for (let i = 0; i < this.anchors.length; i++) {
                this.anchors[i].setSelect(false);
            }
        }
    },
    /**
     * Updates the selected state of anchors/vessels based on mouse location.
     * Changes the current selected set if appropriate.
     */
    handleSelect : function(p5) {
        let p = {
            x : p5.mouseX,
            y : p5.mouseY
        };
        let a = this.getAnchor(p);
        if (a !== null) {
            if (this.multi) {
                if (p5.keyIsPressed) {
                    if (p5.keyCode == p5.CONTROL) {
                        a.setSelect(!a.getSelect());
                    }
                } else {
                    for (let i = 0; i < this.anchors.length; i++) {
                        this.anchors[i].setSelect(this.anchors[i] == a);
                    }
                }
            } else {
                if (p5.keyIsPressed) {
                    if (p5.keyCode == p5.ALT && a !== null) {
                        this.genes.startMultiSelect(this);
                        a.setSelect(true);
                    } else if (p5.keyCode == p5.CONTROL) {
                        const ag = new SortedSet();
                        let add = true;
                        for (let i = 0; i < a.vessels.length; i++) {
                            const av = a.vessels[i];
                            const activeArray = av.activeGenes.toArray();
                            for (let j = 0; j < activeArray.length; j++) {
                                ag.push(activeArray[j]);
                            }
                            add = add && (av.selectedGenes.size() == 0);
                        }
                        a.setSelect(false);
                        let sel = this.genes.getSelectedSet();
                        const agArray = ag.toArray();
                        if (add) {
                            for (let j = 0; j < agArray.length; j++) {
                                sel.push(agArray[j]);
                            }
                        } else {
                            for (let j = 0; j < agArray.length; j++) {
                                if (sel.contains(agArray[j])) {
                                    sel.delete(agArray[j]);
                                }
                            }
                        }
                        this.genes.setSelection(this, sel);
                    }
                } else {
                    let sel = new SortedSet();
                    for (let i = 0; i < a.vessels.length; i++) {
                        const toAdd = a.vessels[i].activeGenes.toArray();
                        for (let j = 0; j < toAdd.length; j++) {
                            sel.push(toAdd[j]);
                        }
                    }
                    a.setSelect(false);
                    this.genes.setSelection(this, sel);
                }
                this.lastAnchor = null;
                this.checkHighlight(p);
            }
        }
        if (a === null) {
            let v = this.getVessel(p);
            if (this.multi) {
                if (v !== null) {
                    if (p5.keyIsPressed) {
                        if (p5.keyCode == p5.CONTROL) {
                            v.setSelect(!V.getSelect());
                        } else {
                            for (let i = 0; i < this.vessels.length; i++) {
                                this.vessels[i].setSelect(this.vessels[i] == v);
                            }
                        }
                    }
                }
            } else {
                if (p5.keyIsPressed) {
                    if (p5.keyCode == p5.ALT && v !== null) {
                        this.genes.startMultiSelect(this);
                        v.setSelect(true);
                    } else if (p5.keyCode == p5.CONTROL) {
                        if (v !== null) {
                            let sel = this.genes.getSelectedSet();
                            if (v.getSelectedCount() > 0) {
                                var vSelected = v.selectedGenes.toArray();
                                for (let i = 0; i < vSelected.length; i++) {
                                    if (sel.contains(vSelected[i])) {
                                        sel.remove(vSelected[i]);
                                    }
                                }
                            } else {
                                var vActive = v.activeGenes.toArray();
                                for (let i = 0; i < vActive.length; i++) {
                                    sel.push(vActive[i]);
                                }
                            }
                            this.genes.setSelection(this, sel);
                            v.setSelect(false);
                        }
                    }
                } else {
                    if (v !== null) {
                        for (let i = 0; i < this.vessels.length; i++) {
                            if (this.vessels[i] != v) {
                                this.vessels[i].clearSelectedGenes();
                            }
                        }
                        v.selectAllGenes();
                    }
                    let sel = new SortedSet();
                    for (let i = 0; i < this.vessels.length; i++) {
                        const selectedArray = this.vessels[i].selectedGenes.toArray();
                        for (let j = 0; j < selectedArray.length; j++) {
                            sel.push(selectedArray[j]); // selectedarRAY J - Get it??????
                        }
                        this.vessels[i].setSelect(false);
                    }
                    this.genes.setSelect(this, sel);
                }
                this.lastVessel = null;
                this.checkHighlight(p);
            }
        }
    },
    highlightVessel : function(v) {
        for (let i = 0; i < this.vessels.length; i++) {
            this.vessels[i].setHighlight(this.vessels[i] == v);
        }
        for (let i = 0; i < this.anchors.length; i++) {
            const b = (v !== null && (this.anchors[i].vessels.indexOf(v) > -1));
            this.anchors[i].setHighlight(b);
        }
    },
    updateCount : function() {
        const c1 = new SortedSet();
        for (let i = 0; i < this.vessels.length; i++) {
            if (this.vessels[i].getHighlight()) {
                const selGenes = this.vessels[i].selectedGenes.toArray();
                for (let j = 0; j < selGenes.length; j++) {
                    c1.push(selGenes[j]);
                }
            }
        }
        this.highCnt = c1.length;
    },
    checkHighlight : function(a, v) {
        if (typeof v === 'undefined') {
            const p = a;
            const anchor = (p === null) ? null : (this.isInGear(p) ? null : this.getAnchor(p));
            const vessel = (p === null) ? null : (a !== null ? null : this.getVessel(p));
            this.checkHighlight(anchor, vessel);
        } else {
            let chg = false;
            if (a != this.lastAnchor) {
                chg = true;
                for (let i = 0; i < this.anchors.length; i++) {
                    this.anchors[i].setHighlight(this.anchors[i] == a);
                    this.anchors[i].setShowLongDesc(this.anchors[i] == a);
                }
                for (let i = 0; i < this.vessels.length; i++) {
                    const b = (a !== null && (this.vessels[i].anchor.indexOf(a) > -1));
                    this.vessels[i].setHighlight(b);
                }
            }
            if (a === null && v != this.lastVessel) {
                chg = true;
                this.highlightVessel(v);
            }
            this.lastAnchor = a;
            this.lastVessel = v;
            if (chg) {
                this.updateCount();
            }
        }
    },
    paintComponent : function(p5) {
        p5.push();
        this.makeTransform(p5, this.WIDTH, this.HEIGHT);
        let drawT = {
            x : this.WIDTH/2.0,
            y : this.HEIGHT/2.0,
            scale : 0.5*Math.min(this.WIDTH/2.0, this.HEIGHT/2.0)/SunGear.R_OUTER
        };
        this.paintExterior(p5);
        p5.pop();
        p5.push();
        this.makeTransform(p5, this.WIDTH, this.HEIGHT);
        p5.fill(SunGear.C_PLAIN);
        for (let i = 0; i < this.vessels.length; i++) {
            this.vessels[i].draw(p5);
        }
        p5.pop();
        p5.push();
        for (let i = 0; i < this.anchors.length; i++) {
            if (this.anchors[i] != this.lastAnchor) {
                this.anchors[i].draw(p5, drawT);
            }
        }
        // draw current mouse-over anchor last, if any?
        if (this.lastAnchor !== null) {
            this.lastAnchor.draw(p5);
        }
        p5.pop();

        p5.push();
        p5.textSize(18);
        p5.textAlign(p5.RIGHT);
        p5.textFont("Helvetica");
        p5.text(this.highCnt+"", this.WIDTH-10, 18);
        p5.text(this.genes.getSelectedSet().length+"", this.WIDTH-10, this.HEIGHT-40);
        p5.text(this.genes.getActiveSet().length+"", this.WIDTH-10, this.HEIGHT-18);
        p5.pop();

        // moon label
        // let ml = null;
        // if (this.genes !== null && this.genes.getSource() !== null && this.genes.getSource().getAttributes() !== null) {
        //     ml = this.genes.getSource().getAttributes().get("moonLabel");
        // }
        // if (ml !== null && this.moon !== null && this.moon.getActiveCount() > 0) {
        //     p5.textSize(14);
        //     // TODO: Something here. Unsure.
        // }
    },
    makeTransform : function(p5, w, h) {
        const M = Math.min(w, h);
        p5.translate(w/2.0, h/2.0);
        p5.scale((0.5*M/SunGear.R_OUTER), (0.5*M/SunGear.R_OUTER));
    },
    updateActive : function() {
        // update active sets
        // find max value
        let max = 0;
        for (let i = 0; i < this.vessels.length; i++) {
            this.vessels[i].setActiveGenes(this.genes.getActiveSet());
            max = Math.max(max, this.vessels[i].getActiveCount());
        }
        // update max values
        // reshape
        for (let i = 0; i < this.vessels.length; i++) {
            this.vessels[i].setMax(max);
            this.vessels[i].makeShape(this.rad_inner);
        }
    },
    updateHighlight : function() {
        const a = this.lastAnchor;
        this.lastAnchor = null;
        const v = this.lastVessel;
        this.lastVessel = null;
        this.checkHighlight(a, v);
    },
    updateSelect : function() {
        const ac = new Comp.VesselACount();
        let min = null;
        if (this.vessels !== null) {
            this.orderedVessels = [];
            for (let i = 0; i < this.vessels.length; i++) {
                this.vessels[i].setSelectedGenes(this.genes.getSelectedSet());
                if (this.vessels[i].getSelectedCount() > 0) {
                    this.orderedVessels.push(this.vessels[i]);
                    if (min === null || ac.compareTo(this.vessels[i], min) < 0) {
                        min = this.vessels[i];
                    }
                }
            }
            // TODO: Make sure this sort function works.
            this.orderedVessels.sort(this.vSort.compareTo);
            this.orderIdx = -1;
            this.firstIdx = (min === null) ? -1 : this.orderedVessels.indexOf(min);
        }
    },
    getMultiSelection : function(operation) {
        const s = new SortedSet();
        let cnt = 0;    // number of selected items in component
        if (operation == MultiSelectable.INTERSECT) {
            const activeArray = this.genes.getActiveSet().toArray();
            for (let i = 0; i < activeArray.length; i++) {
                s.push(activeArray[i]);
            }
        }
        for (let i = 0; i < this.vessels.length; i++) {
            if (this.vessels[i].getSelect()) {
                cnt++;
                const selArray = this.vessels[i].selectedGenes.toArray();
                if (operation == MultiSelectable.UNION) {
                    for (let j = 0; j < selArray.length; j++) {
                        s.push(selArray[j]);
                    }
                } else {
                    const sArray = s.toArray();
                    for (let j = 0; j < sArray.length; j++) {
                        if (!this.vessels[i].selectedGenes.contains(sArray[j])) {
                            // may need remove instead.
                            s.delete(sArray[j]);
                        }
                    }
                }
            }
        }
        for (let i = 0; i < this.anchors.length; i++) {
            if (this.anchors[i].getSelect()) {
                cnt++;
                // find all of anchor's selected genes
                const ag = new SortedSet();
                for (let it = 0; it < this.anchors[i].vessels.length; it++) {
                    const selGenes = this.anchors[i].vessels[it];
                    for (let j = 0; j < selGenes.length; j++) {
                        ag.push(selGenes[j]);
                    }
                }
                const agArray = ag.toArray();
                if (operation == MultiSelectable.UNION) {
                    for (let j = 0; j < agArray.length; j++) {
                        s.push(agArray[j]);
                    }
                } else {
                    const sArray2 = s.toArray();
                    for (let j = 0; j < sArray2.length; j++) {
                        if (!ag.contains(sArray2[j])) {
                            s.delete(sArray2[j]);
                        }
                    }
                }
            }
        }
        return (cnt > 0) ? s : null;
    },
    /**
     * If a GeneEvent occurs, take appropriate action.
     * @param e {GeneEvent}
     */
    listUpdated : function(e) {
        switch(e.getType()) {
            case GeneEvent.NEW_LIST:
                this.set(this.genes.getSource());
                this.updateSelect();
                this.updateHighlight();
                this.stats.update(this.genes);
                break;
            case GeneEvent.NARROW:
                break;
            case GeneEvent.RESTART:
                this.updateActive();
                this.updateSelect();
                this.updateHighlight();
                this.positionVessels();
                this.stats.update(this.genes);
                break;
            case GeneEvent.SELECT:
                this.updateSelect();
                this.updateHighlight();
                break;
            case GeneEvent.MULTI_START:
                this.setMulti(true);
                break;
            case GeneEvent.MULTI_FINISH:
                this.setMulti(false);
                break;
        }
    },

    /**
     * The following six functions are for
     * the selectable icons in the interface.
     */
    prevBFunction : function() {
        this.orderIdx = (this.orderIdx == -1) ? this.firstIdx : (this.orderIdx + this.orderedVessels.length - 1) % this.orderedVessels.length;
        this.order(this.orderIdx);
    },
    nextBFunction : function() {
        this.orderIdx = (this.orderIdx == -1) ? this.firstIdx : (this.orderIdx+1) % this.orderedVessels.length;
        this.order(this.orderIdx);
    },
    /**
     * Triggered by the selB Icon in the SunGear dialog.
     * Then selects genes.
     */
    selBFunction : function() {
        if (this.lastVessel !== null) {
            this.genes.setSelection(this, this.lastVessel.selectedGenes);
            this.highlightVessel(null);
        }
    },
    /**
     * Triggered by clicking the minSizeB bullseye in the SunGear dialog.
     * Either increments or resets the minimum vessel size index
     */
    minSizeBFunction : function() {
        this.setMinVesselSizeIdx((this.minRadIdx + 1) % this.minRad.length);
    },
    /**
     * Triggered by clicking the showArrowB Icon in the SunGear dialog.
     * Toggles whether or not the vessel's arrows should be shown.
     */
    showArrowBFunction : function() {
        this.setShowArrows(!this.showArrows);
    },
    /**
     * Triggered by clicking the statsB Icon in the SunGear dialog.
     * Calls the showStats function.
     */
    statsBFunction : function() {
        this.showStats();
    },
    /**
     * Draws the Icon buttons in the bottom-left corner of the SunGear Dialog
     * Called with every draw loop.
     *
     * @param p5
     */
    makeButtons : function(p5) {
        for (let i = 0; i < this.visuals.length; i++) {
            const model = this.visuals[i].model;
            model.paintIcon(p5, this.visuals[i].params);
        }
    },
    /**
     * Triggered by a p5.mouseReleased event,
     * this function checks to see if any of the icons have been clicked,
     * then triggers their corresponding functions.
     *
     * @param p5
     */
    handleButtons : function(p5) {
        for (let i = 0; i < this.visuals.length; i++) {
            var model = this.visuals[i].model;
            if (model.selected) {
                this.visuals[i].task();
            }
        }
    },
    /**
     * This function uses the existing properties of the exterior shape
     * to draw a polygon with the number of sides
     * corresponding to the number of vessels.
     * It is called with every p5.draw loop.
     *
     * @param p5
     */
    paintExterior : function(p5) {
        p5.stroke(SunGear.C_PLAIN);
        p5.fill(SunGear.C_BACKGROUND);
        p5.strokeWeight(.025);
        if (this.exterior.w === null || this.exterior.h === null) {
            const vertX = this.exterior.x;
            const vertY = this.exterior.y;
            p5.beginShape();
            for (var i = 0; i < vertX.length; i++) {
                p5.vertex(vertX[i], vertY[i]);
            }
            p5.endShape(p5.CLOSE);

        } else {
            p5.ellipseMode(p5.CORNER);
            p5.ellipse(this.exterior.x, this.exterior.y, this.exterior.w, this.exterior.h);
        }
    }
};

/**
 * A Visual Model which acts as a generic parent for SunGear Icons
 *
 * @param model {Icons.Type<T>}
 * @param params {Array}
 * @param task {function}
 * @constructor
 */
function Visual(model, params, task) {
    this.model = model;
    this.params = params;
    this.task = task;
}

module.exports = SunGear;