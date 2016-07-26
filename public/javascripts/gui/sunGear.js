require('javascript.util');
const TreeSet = javascript.util.TreeSet;

const DataReader = require('../data/dataReader');

const AnchorDisplay = require('./sungear/anchorDisplay');
const Comp = require('./sungear/comp');
const Icons = require('./sungear/icons');
const VesselDisplay = require('./sungear/vesselDisplay');

/**
 * Interactive generalization of a Venn diagram to many dimensions.
 */
function SunGear(genes, thresh, statsF) {
    if (typeof statsF === 'undefined') {
        statsF = thresh;
        thresh = 0.0;
    }
    // Custom Rajah object for p5
    this.visuals = [];

    this.vRadMax = 0.1;
    this.minRad = [ 0.0, 0.005, 0.010, 0.015, 0.020 ];

    this.genes = genes;
    this.thresh = thresh;
    this.statsF = statsF;
    this.moon = null;
    this.orderedVessels = [];
    this.vSort = new Comp.VesselSelSize();
    this.polarPlot = false;
    this.showArrows = true;
    this.minRadIdx = 0;

    this.prevB = new Icons.ArrowIcon(2, 4, SunGear.C_PLAIN, SunGear.C_HIGHLIGHT, SunGear.C_SELECT, false);
    this.selB = new Icons.EllipseIcon(3, SunGear.C_PLAIN, SunGear.C_HIGHLIGHT, SunGear.C_SELECT, false);
    this.nextB = new Icons.ArrowIcon(0, 4, SunGear.C_PLAIN, SunGear.C_HIGHLIGHT, SunGear.C_SELECT, false);
    this.statsB = new Icons.StatsIcon(SunGear.C_PLAIN, SunGear.C_HIGHLIGHT, SunGear.C_SELECT);
    // this.saI = [];
    // this.saI.push(new Icons.ShowArrowIcon(SunGear.C_PLAIN, SunGear.C_HIGHLIGHT, SunGear.C_SELECT, true));
    // this.saI.push(new Icons.ShowArrowIcon(SunGear.C_PLAIN, SunGear.C_HIGHLIGHT, SunGear.C_SELECT, false));
    this.saI = new Icons.ShowArrowIcon(SunGear.C_PLAIN, SunGear.C_HIGHLIGHT, SunGear.C_SELECT, true);
    // this.vsI = [];
    // for (var i = 0; i < this.minRad.length; i++) {
    //     this.vsI.push(new Icons.VesselMinIcon(SunGear.C_PLAIN, SunGear.C_HIGHLIGHT, SunGear.C_SELECT, this.minRad.length, 2, i));
    // }
    this.vsI = new Icons.VesselMinIcon(SunGear.C_PLAIN, SunGear.C_HIGHLIGHT, SunGear.C_SELECT, this.minRad.length, 2, 0);
    // TODO: Set tooltips for icons.
    var WIDTH = document.getElementById('sungearGui').offsetWidth;
    var HEIGHT = document.getElementById('sungearGui').offsetHeight;

    var prevBParams = [ 10, HEIGHT-30 ];
    this.visuals.push(new Visual(this.prevB, this.prevB.paintIcon.bind(this.prevB), prevBParams, true));
    var selBParams = [ 35.5, HEIGHT-22 ];
    this.visuals.push(new Visual(this.selB, this.selB.paintIcon.bind(this.selB), selBParams, true));
    var nextBParams = [ 45, HEIGHT-30 ];
    this.visuals.push(new Visual(this.nextB, this.nextB.paintIcon.bind(this.nextB), nextBParams, true));
    var statsBParams = [ 13, HEIGHT-108 ];
    this.visuals.push(new Visual(this.statsB, this.statsB.paintIcon.bind(this.statsB), statsBParams, true));
    var saIParams = [ 20, HEIGHT-50 ];
    this.visuals.push(new Visual(this.saI, this.saI.paintIcon.bind(this.saI), saIParams, true));
    var vsIParams = [ 20, HEIGHT-75 ];
    this.visuals.push(new Visual(this.vsI, this.vsI.paintIcon.bind(this.vsI), vsIParams, true));

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
    
    // TODO: @Dennis use p5 for lines 196 - 255
    
    // this.setFocusable(true);
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
SunGear.C_SELECT_ALT = "#217C7E";

SunGear.prototype = {
    constructor : SunGear,
    cleanup : function() {
        var i = 0;
        for (i = 0; i < this.anchors.length; i++) {
            this.anchors[i].cleanup();
        }
        this.anchors = null;
        for (i = 0; i < this.vessels.length; i++) {
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
    makeButton : function(main, rollover, pressed) {
        console.log("sunGear.makeButton called! But I don't think it's necessary...");
    },
    /**
     * @param n {int}
     */
    order : function(n) {
        if (n != -1) {
            try {
                var v = this.orderedVessels[n];
                this.lastVessel = v;
                this.highlightVessel(v);
                this.updateCount();
                // repaint?
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
        var t = this.thresh;
        console.log("thresh: " + this.thresh);
        if(isNaN(t)) {
            console.log("check");
            t = 1.0;
            try {
                t = src.getAttributes().get("threshold");
            } catch(e) {
                console.log("Oops! From Sungear.set");
            }
        }
        console.log("t: " + t);
        var v = [];
        DataReader.setThreshold(t, this.genes.getGenesSet(), this.src.getReader().anchors, v);
        this.makeDisplay(this.src.getReader().anchors, v);
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
        if (this.vessels !== null) {
            for (var i = 0; i < this.vessels.length; i++) {
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
            console.log("Made it here!");
            for (var i = 0; i < this.vessels.length; i++) {
                this.vessels[i].setShowArrows(b);
                this.positionVessels();
            }
            console.log("Made it out!");
        }
    },
    showStats : function() {
        // TODO: Show Stats Modal
    },
    /**
     * @param g {Gene}
     * @returns {Vector<Term>}
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
        return (this.goTerm === null || this.goTerm.get() === null) ? new TreeSet() : this.goTerm.get().assocGenes;
    },
    /**
     * @param c {Collection<Gene>}
     */
    getTerms : function(c) {
        var t = new TreeSet();
        for (var it = c.iterator(); it.hasNext(); ) {
            var toAdd = this.getGeneTerms(it.next());
            for (var i = 0; i < toAdd.length; i++) {
                t.add(toAdd[i]);
            }
        }
        return t;
    },
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
        var cool = new TreeSet();
        var debug = true; // TODO: Change this in production
        var ag = this.getAssocGenes();
        for (var i = 0; i < this.vessels.length; i++) {
            if (this.vessels[i].getActiveCount() == 0) {
                continue;
            }
            if (debug) {
                console.log("sz: " + this.vessels[i].activeGenes.size());
            }
            var tt = this.getTerms(this.vessels[i].activeGenes);
            var ct = [];
            for (var it = tt.iterator(); it.hasNext(); ) {
                var j = 0;
                var t = it.next();
                var cnt = new TreeSet();
                var cnt2 = new TreeSet();
                var preCnt = t.getAllGenes().toArray();
                var preCnt2 = this.vessels[i].activeGenes.toArray();
                for (j = 0; j < preCnt.length; j++) {
                    if (preCnt2.indexOf(preCnt[j]) > -1) {
                        cnt.add(preCnt[j]);
                    }
                }
                for (j = 0; j < preCnt2.length; j++) {
                    if (ag.contains(preCnt2[j])) {
                        cnt2.add(preCnt2[j]);
                    }
                }
                var z = t.calcScore(cnt.size(), cnt2.size());
                if (z >= minScore) {
                    ct.push(new CoolTerm(z, cnt.size()));
                }
            }
            // per-method stuff - calculate score from cool terms
            var c;
            switch (method) {
                case 1:
                    // threshhold and multiply
                    if (debug) {
                        console.log("\tct: " + ct.size());
                    }
                    var score = 0;
                    for (it = ct.iterator(); it.hasNext(); ) {
                        var t = it.next();
                        score += t.score * t.count;
                    }
                    score /= vessels[i].activeGenes.size();
                    if (debug) {
                        console.log("\tscore: " + score);
                    }
                    c = new Comp.CoolVessel(this.vessels[i], score, this.vessels[i].activeGenes.size());
                    break;
                default:
                    // threshhold only
                    if (debug) {
                        console.log("\tct: " + ct.size());
                    }
                    var acnt = 0;
                    for (it = ct.iterator(); it.hasNext(); ) {
                        var t = it.next();
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
            // TODO: @Dennis ensure this method works for actually getting the last element of the TreeSet
            var coolArray = cool.toArray();
            var last = coolArray[coolArray.length-1];
            if (cool.size() < maxVessels || c.compareTo(last) < 0) {
                if (debug) {
                    console.log("\tadded");
                }
                cool.add(c);
                while(cool.size() > maxVessels) {
                    coolArray = cool.toArray();
                    last = coolArray[coolArray.length-1];
                    cool.remove(last);
                }
            }
            if (debug) {
                console.log();
            }
        }
        console.log("Final scores:");
        for (it = cool.iterator(); it.hasNext(); ) {
            console.log(it.next().score);
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
        var cool = new TreeSet();
        var last;
        for (var i = 0; i < this.vessels.length; i++) {
            var s = this.getTerms(this.vessels[i].activeGenes);
            if (s.size() > 2) {
                var pt = [];    // terms potentially meeting cool criteria (score >= minScore)
                for (var it = s.iterator(); it.hasNext(); ) {
                    var t = it.next();
                    if (t.getScore() >= minScore) {
                        pt.push(t);
                    }
                }
                if (cool.size() > 0) {
                    var coolArray = cool.toArray();
                    last = coolArray[coolArray.length-1];
                } else {
                    last = new Comp.CoolVessel(null, 0, null);
                }
                if ((cool.size() < maxVessels && pt.size() > 0) || (cool.size() == maxVessels && pt.size() >= last.score)) {
                    var acnt = 0;   // number of terms actually meeting cool criteria (pcnt genes with gene count >= 2)
                    var tot = 0;    // total number of genes across all intersections
                    for (it = 0; it < pt.length; it++) {
                        var t = pt[it];
                        var gs = new TreeSet();
                        var allGenes = t.getAllGenes();
                        var geneActive = this.genes.getActiveSet().toArray();
                        var vesselActive = this.vessels[i].activeGenes.toArray();
                        for (var j = 0; j < allGenes.length; j++) {
                            if (geneActive.indexOf(allGenes[j]) > -1 && vesselActive.indexOf(allGenes[j]) > -1) {
                                gs.add(allGenes[j]);
                            }
                        }
                        if (gs.size() >= 2) {
                            acnt++;
                            tot += gs.size();
                        }
                    }
                    if (acnt > 0) {
                        cool.add(new Comp.CoolVessel(this.vessels[i], acnt, tot));
                        while (cool.size() > maxVessels) {
                            // TODO: Ensure this works.
                            coolArray = cool.toArray();
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
     * @param anch {Vector<Anchor>}
     * @param ves {Vector<Vessel>}
     */
    makeDisplay : function(anch, ves) {
        // find vessel min/max vals
        this.vMax = 0;
        this.vMin = Number.MAX_VALUE;
        var i = 0;
        for (i = 0; i < ves.size(); i++) {
            var v = ves[i];
            this.vMax = Math.max(this.vMax, v.getFullCount());
            this.vMin = Math.max(this.vMin, v.getFullCount());
        }
        // init anchor display components
        this.anchors = [];
        var anchorConv = {};
        var t = 3.0 * Math.PI / 2.0;
        var dt = 2.0 * Math.PI / this.anchors.length;
        for (i = 0; i < this.anchors.length; i++) {
            var a = anch[i];
            this.anchors[i] = new AnchorDisplay(a);
            anchorConv[a] = this.anchors[i];
            this.anchors[i].setScale(Math.min(1, 8.0/this.anchors.length));
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
            var x = [];
            var y = [];
            for (var i = 0; i < this.anchors.length; i++) {
                var t1 = anchors[i].getAngle();
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
        var vesselConv = {};
        for (var i = 0; i < this.vessels.length; i++) {
            var v = ves[i];
            this.vessels[i] = new VesselDisplay(v);
            vesselConv[v] = this.vessels[i];
            this.vessels[i].setRadMin(this.minRad[this.minRadIdx]);
            this.vessels[i].setShowArrows(this.showArrows);
            this.vessels[i].setAnchors(anchorConv);
            this.vessels[i].setMax(this.vMax);
            this.vessels[i].initActive();
            // TODO: Maybe add this to visuals stack instead.
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
            this.positionvesselsPolar();
        } else {
            this.positionVesselsCartesian();
        }
    },
    positionVesselsPolar : function() {
        for (var i = 0; i < this.vessels.length; i++) {
            if (this.vessels[i].anchor.length > 0) {
                var r = this.rad_inner * (1.0 - (this.vessels[i].anchor.length - 1.0)/(this.anchors.length-1.0));
                var x = this.vessels[i].getStart().x;
                var y = this.vessels[i].getStart().y;
                var d = Math.sqrt(x*x + y*y);
                var t = (d < .001) ? this.vessels[i].anchor[0].getAngle() : Math.atan2(y, x);
                this.vessels[i].getCenter().x = r * Math.cos(t);
                this.vessels[i].getCenter().y = r * Math.sin(t);
                this.vessels[i].setRadMax(.05);
                this.vessels[i].updateCenter();
            }
        }
    },
    positionVesselsCartesian : function() {
        for (var i = 0; i < this.vessels.length; i++) {
            this.vessels[i].getCenter().x = this.vessels[i].getStart().x;
            this.vessels[i].getCenter().y = this.vessels[i].getStart().y;
            this.vessels[i].updateCenter();
        }
        if (this.relax) {
            this.adjustCenters(.005);
            this.relaxCenters();
        } else {
            this.adjustCenters(1.0);
        }
    },
    relaxCenters : function() {
        var maxIter = 200;
        var eta = 1.0;
        var decay = 0.01;
        var energy = this.vessels.length;
        var cnt = 0;
        do {
            var e = this.relaxStep(eta);
            energy = e;
            eta *= (1-decay);
            cnt++;
        } while (cnt < 10 || (energy*eta > 5e-5*this.vessels.length && cnt < maxIter));
        for (var i = 0; i < this.vessels.length; i++) {
            this.vessels[i].updateCenter();
        }
    },
    /**
     * @param eta {double}
     * @return {double}
     */
    relaxStep : function(eta) {
        // scaling factor to give extra space for vessels (and arrows)
        var sf = 1.5;
        // random factor added to or substracted from movement
        var rf = 0.3;
        var i = 0;
        for (i = 0; i < this.vessels.length; i++) {
            var v = this.vessels[i];
            if (v.anchor.length == 0 || v.getActiveCount() == 0) {
                continue;
            }
            // weak attraction to center point
            v.dx = 0.02 * (v.getStart().x - v.getCenter().x);
            v.dy = 0.02 * (v.getStart().y - v.getCenter().y);
            // strong repulsion from border
            var md = Math.sqrt(v.getCenter().x*v.getCenter().x + v.getCenter().y*v.getCenter().y);
            if (md > 1) {
                v.dx -= (md-1) * v.getCenter().x;
                v.dy -= (md-1) * v.getCenter().y;
            }
        }
        // overlapping vessels repel
        for (i = 0; i < this.vessels.length; i++) {
            var v1 = this.vessels[i];
            if (v1.getActiveCount() == 0) {
                continue;
            }
            for (var j = i+1; j < this.vessels.length; j++) {
                var v2 = this.vessels[j];
                if (v2.getActiveCount() == 0) {
                    continue;
                }
                // x & y distance b/t points, and total radius
                var ax = v1.getCenter().x - v2.getCenter().x;
                var ay = v1.getCenter().y - v2.getCenter().y;
                var ar = sf * (v1.getRadOuter() + v2.getRadOuter());
                // do vessels overlap?
                if (ax*ax + ay*ay < ar*ar) {
                    // how much the overlap is
                    var adist = Math.sqrt(ax*ax + ay*ay);
                    var dr = ar - adist;
                    var dx;
                    var dy;
                    if (adist < 1e-12) {
                        // total overlap = vessel centers are the same
                        // TODO: Make sure this works the same way.
                        var t = Math.random() * 2 * Math.PI;
                        dx = sf * dr * Math.cos(t);
                        dy = sf * dr * Math.sin(t);
                    } else {
                        dx = 0.75 * (dr/adist) * (v2.getCenter().x - v1.getCenter().x);
                        dy = 0.75 * (dr/adist) * (v2.getCenter().y - v1.getCenter().y);
                    }
                    var iv = this.vessels[i].anchor.length;
                    var jv = this.vessels[i].anchor.length;
                    v1.dx -= (jv/(iv+jv)) * dx * (1 + 2*rf*Math.random()-rf);
                    v1.dy -= (jv/(iv+jv)) * dy * (1 + 2*rf*Math.random()-rf);
                    v2.dx += (jv/(iv+jv)) * dx * (1 + 2*rf*Math.random()-rf);
                    v2.dy += (iv/(iv+jv)) * dy * (1 + 2*rf*Math.random()-rf);
                }
            }
        }
        var e = 0;
        for (i = 0; i < this.vessels.length; i++) {
            var v = this.vessels[i];
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
        var l = [];
        var i = 0;
        for (i = 0; i < this.vessels.length; i++) {
            if (this.vessels[i].getActiveCount() == 0) {
                continue;
            }
            var p = this.vessels[i].getCenter();
            var added = false;
            for (var j = 0; j < l.length && !added; j++) {
                var v = l[j];
                // TODO: Get distance.
                var distX = p.x - v[0].getCenter().x;
                var distY = p.y - v[0].getCenter().y;
                var dist = Math.sqrt((distX*distX) + (distY*distY));
                if (dist < .0001) {
                    v.push(this.vessels[i]);
                    added = true;
                }
            }
            if (!added) {
                var v = [];
                v.push(this.vessels[i]);
                l.push(v);
            }
        }

        // offset centers of same-centered vessels
        for (i = 0; i < l.length; i++) {
            var v = l[i];
            if (v.length == 1) {
                continue;
            }
            for (var k = 0; k < v.length; k++) {
                var curr = v[k];
                var p = curr.getCenter();
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
        for (var i = 0; i < this.anchors.length; i++) {
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
        for (var i = 0; i < this.vessels.length; i++) {
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
        var p = {
            x : p5.mouseX,
            y : p5.mouseY
        };
        var chg = false;
        var a = this.getAnchor(p);
        var i = 0;
        for (i = 0; i < this.anchors.length; i++) {
            chg = chg || (this.anchors[i].getSelect() != (this.anchors[i] == a));
            this.anchors[i].setSelect(this.anchors[i] == a);
        }
        var v = this.getVessel(p);
        for (i = 0; i < this.vessels.length; i++) {
            chg = chg || (this.vessels[i].getSelect() != (this.vessels[i] == v));
            this.vessels[i].setSelect(this.vessels[i] == v);
        }
        if (chg) {
            // TODO: Maybe do something here.
            console.log("Hey Dennis, maybe implement a repaint function?");
        }
    },
    setMulti : function(b) {
        this.multi = b;
        if (!b) {
            var i = 0;
            for (i = 0; i < this.vessels.length; i++) {
                this.vessels[i].setSelect(false);
            }
            for (i = 0; i < this.anchors.length; i++) {
                this.anchors[i].setSelect(false);
            }
        }
    },
    handleSelect : function(p5) {
        var p = {
            x : p5.mouseX,
            y : p5.mouseY
        };
        var a = this.getAnchor(p);
        var i = 0;
        if (a !== null) {
            if (this.multi) {
                if (p5.keyIsPressed) {
                    if (p5.keyCode == p5.CONTROL) {
                        a.setSelect(!a.getSelect());
                    }
                } else {
                    for (i = 0; i < this.anchors.length; i++) {
                        this.anchors[i].setSelect(this.anchors[i] == a);
                    }
                }
            } else {
                if (p5.keyIsPressed) {
                    if (p5.keyCode == p5.ALT && a !== null) {
                        this.genes.startMultiSelect(this);
                        a.setSelect(true);
                    } else if (p5.keyCode == p5.CONTROL) {
                        var ag = new TreeSet();
                        var add = true;
                        for (i = 0; i < a.vessels.length; i++) {
                            var av = a.vessels[i];
                            var activeArray = av.activeGenes.toArray();
                            for (var j = 0; j < activeArray.length; j++) {
                                ag.add(activeArray[j]);
                            }
                            add = add && (av.selectedGenes.size() == 0);
                        }
                        a.setSelect(false);
                        // TODO: Pick up at 816
                    }
                }
            }
        }
    },

    getVisuals : function() {
        return this.visuals;
    }
};

function Visual(model, drawFunction, params, draw) {
    this.model = model;
    this.drawFunction = drawFunction;
    this.params = params;
    this.draw = draw;
}

module.exports = SunGear;