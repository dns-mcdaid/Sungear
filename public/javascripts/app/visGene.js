/**
 * Top-level GUI component for Sungear.  Can be instantiated
 * as an applet or an application.
 *
 * @author crispy
 */

var DataReader = require('../data/dataReader');
var DataSource = require('../data/dataSource');

var SunGear = require('../gui/sunGear');
var ExportList = require('../gui/exportList');

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
        this.sungearF = document.getElementById("sungearF");
        var statsF = null; // TODO: @Dennis fix.
        this.gear = new SunGear(this.geneList, statsF);

        // control panel component
        this.export = new ExportList(this.geneList, this.context);
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