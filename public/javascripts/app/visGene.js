/**
 * Top-level GUI component for Sungear.  Can be instantiated
 * as an applet or an application.
 *
 * @author RajahBimmy
 */

var DataReader = require('../data/dataReader');
var DataSource = require('../data/dataSource');
var ParseException = require('../data/parseException');

var GeneList = require('../genes/geneList');

var ExportList = require('../gui/exportList');
var GoTerm = require('../gui/goTerm');
var SunGear = require('../gui/sunGear');

var Controls = require('../gui/controls');
var CollapsibleList = require('../gui/collapsibleList');

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
        this.isApp = true;  // TODO: Make sure this doesn't cause any problems.
        this.base = u;
        this.context = null;
        this.showWarning = w;
        this.pluginName = pn;
        this.dataDir = dataDir;
    }
}

VisGene.VERSION = "0.2.0";
VisGene.DEFAULT_DATA_DIR = "../data";
VisGene.notice = "Copyright Chris Poultney, Radhika Mattoo, and Dennis McDaid 2016";

VisGene.prototype = {
    constructor : VisGene,
    /**
     * This function initializes the top navbar options
     * And instantiates the GO Terms, Controls, SunGear, and (I believe) Gene Frame
     * It is not totally complete, however most of it should work.
     */
    init : function() {
        // RIP lines 144 - 206
        console.log(this.extAttrib);
        if (this.dataDir === null) {
            this.dataDir = VisGene.DEFAULT_DATA_DIR;
        }
        if (this.dataDir[this.dataDir.length-1] != "/") {
            this.dataDir += "/";
        }
        this.dataU = new DataReader().makeURL(this.base, this.dataDir);

        // prepare for data source
        this.src = new DataSource(this.dataU);
        this.geneList = new GeneList();
        var loadI = document.getElementById('nav-load');
        var screenI = document.getElementById('screenshot');
        loadI.addEventListener("click", function() {
            // TODO: @Dennis implement lines 241 - 287
                // Should open a new alert
                // Allow the user to pick a set from a table
                // Then reload the page
        });
        screenI.addEventListener("click", function() {
            // TODO: @Dennis implement lines 288 - 310
        });
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
        var temp = this;
        helpI.addEventListener("click", function() {
            temp.showAbout();
        });
        infoI.addEventListener("click", function() {
            this.showInfo();
        });

        // init component sizes
        // this.positionWindows();
        // TODO: lines 404 - 445
        document.getElementById('reposition').addEventListener("click", function() {
            this.positionWindows();
        });
        var relaxC = document.getElementById('relax-vessels');
        relaxC.addEventListener("click", function() {
            var val = (relaxC.title === 'true');
            this.gear.setRelax(val);
            val = !val;
            relaxC.title = val.toString();
        });
        var fullC = document.getElementById('full-screen');
        fullC.addEventListener("click", function() {
            // TODO: Make full screen function.
        });
    },
    run : function() {
        try {
            if (this.extAttrib !== null && this.extAttrib.get("sungearU") !== null) {
                this.src.setAttributes(this.extAttrib, this.dataU);
                this.openFile(this.extAttrib);  // TODO: Implement
            }
        } catch (e) {
            console.log(e);
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
        // TODO: Implement this later.
    },
    poisitionWindows : function() {
        // TODO: Implement this later.
    },
    /**
     * Sets all desktop window sizes and positions to their defaults.
     */
    makeFrame : function() {
        // TODO: Implement this later.
    },
    /**
     * Makes a check box menu item with JInternalFrame iconify control.
     * @param f the internal frame to control
     * @return the check box item
     */
    makeItem : function(f) {
        // TODO: Implement this later.
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
        var msg = "";
        msg += "Sungear Version " + VisGene.VERSION + "\n\n";
        msg += "Sungear is a collaboration between the Biology Department and the Courant Institute of Mathematical Sciences, New York University.\n\n";
        msg += "Primary Developer:\nChris Poultney\n\n";
        msg += "Seconday Developers:\nRadhika Mattoo\nDennis McDaid\n\n";
        msg += "GeneLights Developers:\nDelin Yang\nEric Leung\n\n";
        msg += "NYU-Biology:\nGloria Coruzzi\nRodrigo A. Gutierrez\nManpreet Katari\n\n";
        msg += "NYU-Courant:\nDennis Shasha\n\n";
        msg += "Additional Collaborators:\nBradford Paley (Didi, Inc.)\n\n";
        msg += "This work has been partly supported by the U.S. National Science Foundation under grants NSF IIS-9988345, N2010-0115586, and MCB-0209754. This support is greatly appreciated.\n\n";
        msg += "For more information visit: http://virtualplant.bio.nyu.edu/\n\n";
        msg += "Copyright 2016, New York University";
        alert(msg);
    },
    /**
     * Show the usage message and exit.
     */
    usage : function() {
        console.log("Launches Sungear application");
        console.log("--version: shows current Sungear application version");
        console.log("--usage or --help: shows this message");
        console.log("-nowarn: suppress warning message dialogs (useful for giving demos)");
        console.log("-data_dir {dirname}: use absolute or relative path {dirname} as data directory (default: ../data)");
        console.log("-plugin: followed by comma-separate list of plugins to load, e.g. gui.GeneLights");
        console.log("GeneLights plugin is distributed with Sungear; others must be available in classpath");
        console.log("-plugin flag can appear multiple times instead of or in combination with using comma-separation");
    },
    /**
     * @param args {String[]}
     */
    main : function(args) {
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
            var vis = new VisGene(new URL("./"), warn, plugin, dataDir);
            vis.init();
        } catch(mu) {
            console.log(mu);
        }
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
    run : function() {
        // TODO: Implement. Figure out how to impact a VisGene member.
    },
    getException : function() {
        return this.ex;
    }
};

module.exports = VisGene;