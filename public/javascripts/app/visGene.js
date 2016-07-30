/**
 * Top-level GUI component for Sungear.  Can be instantiated
 * as an applet or an application.
 *
 * @author RajahBimmy
 */

const fs = require('browserify-fs');
const path = require('path');

const Signal = require('./signal');

const Attributes = require('../data/attributes');
const DataReader = require('../data/dataReader');
const DataSource = require('../data/dataSource');
const ParseException = require('../data/parseException');

const GeneList = require('../genes/geneList');

const ExperimentList = require('../gui/experimentList');
const ExportList = require('../gui/exportList');
const GoTerm = require('../gui/goTerm');
const SunGear = require('../gui/sunGear');

const Controls = require('../gui/controls');
const CollapsibleList = require('../gui/collapsibleList');

/**
 * @param u {URL}
 * @param w {boolean}
 * @param pn {String[]}
 * @param dataDir {String}
 * @constructor
 */
function VisGene(u, w, pn, dataDir) {
    console.log(VisGene.notice);

    var btnMargin = document.createElement("div");
    btnMargin.id = "Button.margin";
    var toggleBtn = document.createElement("div");
    toggleBtn.id = "ToggleButton.margin";

    this.base = null;   /** URL of code directory */
    this.dataU = null;  /** URL of data directory */
    this.isApp = true;  /** Generic external connection info */

    this.extAttrib = null;  /** {Attributes} */
    this.desk = null;       /** {JDesktopPane} */
    this.geneList = null;   /** {GeneList} */
    this.src = null;        /** {DataSource} */

    this.geneF = null;      /** {JInternalFrame} */
    this.sungearF = null;   /** {JInternalFrame} */
    this.controlF = null;   /** {JInternalFrame} */
    this.goF = null;        /** {JInternalFrame} */
    this.pluginF = [];      /** {Vector<JInternalFrame>} */

    this.geneM = null;      /** {JCheckBoxMenuItem} */
    this.sungearM = null;   /** {JCheckBoxMenuItem} */
    this.controlM = null;   /** {JCheckBoxMenuItem} */
    this.goM = null;        /** {JCheckBoxMenuItem} */
    this.pluginM = [];      /** {Vector<JCheckBoxMenuItem>} */
    
    this.l1 = null;         /** {CollapsibleList} */
    this.control = null;    /** {Controls} */
    this.gear = null;       /** {SunGear} */
    this.go = null;         /** {GoTerm} */
    this.export = null;     /** {ExportList} */

    // TODO: @Dennis ensure that plugin is unnecessary
    this.plugin = [];       /** {Vector<SungearPlugin>} */
    this.topFrame = null;   /** {Frame} */
    this.pluginName = [];   /** {String[]} */

    /** True to show pop-up for missing/duplicate genes on load */
    this.showWarning = false;
    /** Absolute or relative path to directory containing species and experiment data */
    this.dataDir = null;

    if (typeof u !== 'undefined') {
        this.isApp = true;
        this.base = u;
        this.context = null;
        this.showWarning = w;
        this.pluginName = pn;
        this.dataDir = dataDir;
    }

    this.signal = null;
}

VisGene.VERSION = "1.2.0";
VisGene.DEFAULT_DATA_DIR = "../data";
VisGene.notice = "Copyright Chris Poultney, Radhika Mattoo, and Dennis McDaid 2016";

VisGene.prototype = {
    constructor : VisGene,
    /**
     * TODO: FINISH
     *
     * This function initializes the top navbar options
     * And instantiates the GO Terms, Controls, SunGear, and (I believe) Gene Frame
     * It is not totally complete, however most of it should work.
     */
    init : function() {
        console.log("Made it to VisGene.init!");
        // RIP lines 144 - 206
        console.log(this.extAttrib);
        if (this.dataDir === null) {
            this.dataDir = VisGene.DEFAULT_DATA_DIR;
        }
        if (this.dataDir[this.dataDir.length-1] != "/") {
            this.dataDir += "/";
        }
        this.dataU = DataReader.makeURL(this.base, this.dataDir);

        // prepare for data source
        this.src = new DataSource(this.dataU);
        this.geneList = new GeneList();

        // build GUI
        var loadI = document.getElementById('nav-load');
        var screenI = document.getElementById('screenshot');
        // REPLACING OLD SUNGEAR ExperimentList implementation with new js version.
        // loadI.addEventListener("click", this.loadExperiments.bind(this));
        var loadBody = document.getElementById('loadBody');

        // TODO: Uncommment this!!!!
        // this.exp = new ExperimentList(new URL("exper.txt", this.dataU), new URL("species.txt", this.dataU), this.dataU, loadBody);
        var openB = document.getElementById('openB');
        openB.addEventListener('click', this.loadExperiment.bind(this));

        screenI.addEventListener("click", this.requestScreenshot.bind(this));
        this.geneF = document.getElementById("geneF");
        this.l1 = new CollapsibleList(this.geneList);
        // TODO: Attach l1 to geneF
        this.sungearF = document.getElementById("sungearF");
        var statsF = null; // TODO: @Dennis fix.
        this.gear = new SunGear(this.geneList, statsF);
        // TODO: @Dennis implement resultsF (333-335)
        var resultsF = null;
        this.go = new GoTerm(this.geneList, resultsF);
        // control panel component
        this.controlF = document.getElementById("controlF");
        this.export = new ExportList(this.geneList, this.context);
        this.control = new Controls(this.geneList, this.export);
        
        
        // Picking up from 388
        var helpI = document.getElementById('helpI');
        var infoI = document.getElementById('infoI');
        helpI.addEventListener("click", this.showAbout.bind(this));
        infoI.addEventListener("click", this.showInfo.bind(this));

        // init component sizes
        // this.positionWindows();
        // TODO: lines 404 - 445
        document.getElementById('reposition').addEventListener("click", this.positionWindows.bind(this));
        this.relaxC = document.getElementById('relax-vessels');
        this.relaxC.addEventListener("click", this.toggleRelax.bind(this));
        var fullC = document.getElementById('full-screen');
        fullC.addEventListener("click", this.toggleFullScreen.bind(this));

        this.aboutDLabel = document.getElementById('aboutDLabel');
        this.aboutDBody = document.getElementById('aboutDBody');
    },
    run : function() {
        try {
            if (this.extAttrib !== null && this.extAttrib.get("sungearU") !== null) {
                this.src.setAttributes(this.extAttrib, this.dataU);
                this.openFile(this.extAttrib);  // TODO: Implement
            }
        } catch (e) {
            console.error(e);
        }
    },
    /**
     * TODO: Ensure this works. It probably doesn't.
     * @param p {Container}
     */
    destroyAll : function(p) {
        var c = p;
        for (var i = 0; i < c.length; i++) {
            if (Array.isArray(c[i])) {
                this.destroyAll(c[i]);
            }
        }
        p = null;
    },
    /**
     *
     */
    destroy : function() {
        console.log("Destroy Enter");
        // this.super.destroy?
        this.topFrame = null;
        // destroyAll(getContentPane())?
        this.desk = null;
        this.l1.cleanup();
        this.l1 = null;
        this.geneF = null;
        this.sungearM = null;
        this.controlM = null;
        this.geneM = null;
        this.gear.cleanup();
        this.gear = null;
        this.sungearF = null;
        this.go.cleanup();
        this.goF = null;
        this.goM = null;
        this.control.cleanup();
        this.control = null;
        this.export.cleanup();
        this.export = null;
        this.controlF = null;
        // this.geneLightsF = null;
        this.src.cleanup();
        this.src = null;
        this.geneList.cleanup();
        this.geneList = null;
        console.log("Done.")
    },
    toggleFullScreen : function() {
        this.fullScreen = !this.fullScreen;
        this.signal = Signal.FULLSCREEN;
    },
    positionWindows : function() {
        // TODO: Implement this later.
        console.log("visGene.positionWindows called! Please implement me.");
    },
    /**
     * Sets all desktop window sizes and positions to their defaults.
     */
    makeFrame : function() {
        // TODO: Implement this later.
        console.log("visGene.makeFrame called! Please implement me.")
    },
    /**
     * Makes a check box menu item with JInternalFrame iconify control.
     * @param f the internal frame to control
     * @return the check box item
     */
    makeItem : function(f) {
        // TODO: Implement this later.
        console.log("visGene.makeItem called! Please implement me.");
    },
    /**
     * Opens an experiment file.
     * @throws IOException
     * @throws ParseException
     */
    openFile : function(attrib) {
        console.log("data file: " + attrib.get("sungearU"));
        var f = null; // FIXME: Should be JOptionPane.getFrameForComponent(this)
        var status = new StatusDialog(f, this);
        var t = new LoadThread(attrib, status);
        t.start();
        // TODO: Make status visible.
        if (t.getException() !== null) {
            console.log(t.getException());
            if (typeof t.getException() === 'ParseException') {
                console.log("line: " + t.getException().getLine());
                alert("Error reading Data: " + t.getException().getMessage());
            }
        } else {
            var iL = attrib.get("itemsLabel", "items");
            var cL = attrib.get("categoriesLabel", "categories");
            // TODO: Change the geneF, geneM, goF, and goM titles
            var r = this.src.getReader();
            if (this.showWarning && r.missingGenes.size() + r.dupGenes.size() > 0) {
                var msg = "There are inconsistencies in this data file:";
                if (r.missingGenes.size() > 0) {
                    msg += "\n" + r.missingGenes.size() + " input " + iL + " unknown to Sungear have been ignored.";
                }
                if (r.dupGenes.size() > 0) {
                    msg += "\n" + r.dupGenes.size() + " " + iL + " duplicated in the input file; only the first occurence of each has been used.";
                }
                msg += "\nThis will not prevent Sungear from running, but you may want to resolve these issues.";
                msg += "\nSee Help | File Info for details about the " + iL + " involved.";
                alert(msg);
            }
        }
        // TODO: Finish
    },
    capFirst : function(s) {
        if (s.length > 1) {
            return s[0].toUpperCase();
        } else if (s.length == 1) {
            return s.toUpperCase();
        } else {
            return s;
        }
    },
    showAbout : function() {
        this.aboutDLabel.innerHTML = "Sungear Version " + VisGene.VERSION;
        var msg = "<p>Sungear is a collaboration between the Biology Department and the Courant Institute of Mathematical Sciences, New York University.</p><br />";
        msg += "<p>Primary Developer:</p><p>Chris Poultney</p><br />";
        msg += "<p>Javascript Developers:</p><p><a href='https://github.com/radhikamattoo'>Radhika Mattoo</a></p><p><a href='https://github.com/RajahBimmy'>Dennis McDaid</a></p><br />";
        msg += "<p>GeneLights Developers:</p><p>Delin Yang</p><p>Eric Leung</p><br />";
        msg += "<p>NYU-Biology:</p><p>Gloria Coruzzi</p><p>Rodrigo A. Gutierrez</p><p>Manpreet Katari</p><br />";
        msg += "<p>NYU-Courant:</p><p>Dennis Shasha</p><br />";
        msg += "<p>Additional Collaborators:</p><p>Bradford Paley (<a href='http://www.didi.com/'>Didi, Inc.</a>)</p><br />";
        msg += "<p>This work has been partly supported by the U.S. National Science Foundation under grants NSF IIS-9988345, N2010-0115586, and MCB-0209754. This support is greatly appreciated.</p><br />";
        msg += "<p>For more information visit: <a href='http://virtualplant.bio.nyu.edu/'>http://virtualplant.bio.nyu.edu/</a></p><br />";
        msg += "<p>Copyright 2005-2016, New York University</p>";
        this.aboutDBody.innerHTML = msg;
    },
    formatComment : function(a, commentName) {
        var comment = a.get(commentName, "(none)\n");
        return comment.substring(0, Math.max(0, comment.length -1));
    },
    showInfo : function() {
        var msg = "";
        msg += "Sungear File Information\n\n";
        if (this.src === null || this.src.getAttributes() === null || this.src.getAttributes().get("sungearU") === null) {
            msg += "No file loaded.";
        } else {
            var a = this.src.getAttributes();
            var il = a.get("itemsLabel", "items");
            var cl = a.get("categoriesLabel", "categories");
            msg += "Sungear file:\t\t" + a.get("sungearU") + "\n";
            msg += "Species:\t\t" + a.get("species") + "\n";
            msg += "File info:\t\t" + this.formatComment(a, "comment-sungear") + "\n";
            msg += il + " annotation file:\t\t" + a.get("geneU") + "\n";
            msg += "File info:\t\t" + this.formatComment(a, "comment-items") + "\n";
            msg += cl + " annotation file:\t\t" + a.get("listU") + "\n";
            msg += "File info:\t\t" + this.formatComment(a, "comment-categories") + "\n";
            msg += cl + " hierarchy file:\t\t" + a.get("hierU") + "\n";
            msg += "File info:\t\t" + this.formatComment(a, "comment-hierarchy") + "\n";
            msg += il + "/" + cl + " correspondence:\t\t" + a.get("assocU");
            msg += "File info:\t\t" + this.formatComment(a, "comment-correspondence") + "\n";
            msg += "Background:\t\t" + a.get("background", "(none)") + "\n";
            msg += "Unknown " + il + " (" + this.src.getReader().missingGenes.size() + "):\t\t";
            if (this.src.getReader().missingGenes.size() == 0) {
                msg += "(none)";
            } else {
                for (var it = this.src.getReader().missingGenes.iterator(); it.hasNext(); ) {
                    msg += it.next() + " ";
                }
            }
            // TODO: Include plugin information? Maybe? Maybe not?
        }
        alert(msg);
    },
    toggleRelax : function() {
        var val = (this.relaxC.title === 'true');
        this.gear.setRelax(val);
        val = !val;
        this.relaxC.title = val.toString();
    },

    loadExperiment : function() {
        try {
            var exper = this.exp.getSelection();
            if (exper !== null) {
                var attrib = new Attributes();
                if (exper.getAttribFile() !== null) {
                    attrib.parseAttributes(new URL(exper.getAttribFile(), this.dataU));
                }
                attrib.put("sungearU", DataReader.makeURL(this.dataU, exper.getFileName()));
                if (exper.getSpecies() !== null) {
                    attrib.put("species", exper.getSpecies());
                }
                this.src.setAttributes(attrib, this.dataU);
                this.openFile(attrib);
                // TODO: Potentially show warning messages based on plugins.
            }
        } catch (ex) {
            console.error(ex);
        }
    },
    requestScreenshot : function() {
        this.signal = Signal.SCREENSHOT;
    }
};

/**
 * Generic status dialog class that tries to position itself in the
 * center of the parent window and automatically size itself to its
 * message (which can be changed dynamically).
 * @author RajahBimmy
 */
function StatusDialog(f, parent) {
    this.parent = parent;
    this.progress = null; // FIXME: Should be a progress bar.
    // TODO: Make progress bar load.
}

StatusDialog.prototype.updateStatus = function(msg, prog) {
    // this.progress.setString(msg);
    // this.progress.setValue(prog);
};

/**
 * Experiment and master data load thread to separate the load
 * operation from the main GUI thread.
 * @author RajahBimmy
 */
/**
 * Loads an experiment and, if necessary, master data, giving
 * load status updates.
 * @param u URL of the experiment file to load
 * @param status dialog for status updates
 */
function LoadThread(attrib, status) {
    this.attrib = attrib;
    this.status = status;
    this.ex = null;
}

LoadThread.prototype = {
    constructor : LoadThread,
    run : function(parent) {
        try {
            parent.src.set(this.attrib, this.status);
            this.status.updateStatus("Preparing Sungear Display", 4);
            parent.geneList.setSource(parent.src);
            parent.geneList.update();
            this.status.updateStatus("Done", 5);
        } catch (oo) {
            if (typeof oo !== ParseException) {
                console.error("Out of memory?");
                this.status.updateStatus("ERROR: Out of memory", 5);
                // this.status.setModal(false);
                parent.src.getReader().clear();
                this.ex = new ParseException("Out of memory");
            } else {
                this.ex = oo;
            }
        }
        // this.status.setVisible(false);
        // this.status.dispose();
        return;
    },
    getException : function() {
        return this.ex;
    }
};

/**
 * Show the usage message and exit.
 */
VisGene.usage = function(){
    console.log("Launches Sungear application");
    console.log("--version: shows current Sungear application version");
    console.log("--usage or --help: shows this message");
    console.log("-nowarn: suppress warning message dialogs (useful for giving demos)");
    console.log("-data_dir {dirname}: use absolute or relative path {dirname} as data directory (default: ../data)");
    console.log("-plugin: followed by comma-separate list of plugins to load, e.g. gui.GeneLights");
    console.log("GeneLights plugin is distributed with Sungear; others must be available in classpath");
    console.log("-plugin flag can appear multiple times instead of or in combination with using comma-separation");
};
/**
 * @param args {String[]}
 */
VisGene.main = function(args) {
    try {
        var i = 0;
        var warn = true;
        var plugin = [];
        var dataDir = null;
        while (i < args.length && args[i][0] == "-" || args[i] == "demo") {
            if (args[i].localeCompare("--version")) {
                console.log(VisGene.VERSION);
            } else if (args[i] == "--usage" || args[i] == "--help") {
                this.usage();
            } else if (args[i] == "demo" || args[i] == "-nowarn") {
                warn = false;
                i++;
            } else if (args[i] == "-plugin") {
                var f = args[i+1].split(",");
                for (var s = 0; s < f.length; s++) {
                    plugin.push(f[s]);
                }
                i += 2;
            } else if (args[i] == "-data_dir") {
                dataDir = args[i+1];
                i += 2;
            } else {
                console.log("ERROR: Unkown argument " + args[i]);
                this.usage();
            }
        }
        for (var j = i; j < args.length; j++) {
            plugin.push(args[j]);
        }
        // FIXME: Potentially replace first arg with new URL()
        var vis = new VisGene(new URL("file:./"), warn, plugin, dataDir);
        vis.init();
        return vis;
    } catch(mu) {
        console.error(mu);
    }
};

module.exports = VisGene;