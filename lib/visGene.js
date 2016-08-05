const url = require('url');

const ExperimentList = require('./experimentList');

const Attributes = require('../public/javascripts/data/attributes');
const DataReader = require('../public/javascripts/data/dataReader');
const DataSource = require('../public/javascripts/data/dataSource');
const ExternalConnection = require('../public/javascripts/data/externalConnection');
const VPConnection = require('../public/javascripts/data/vpConnection');
const ParseException = require('../public/javascripts/data/parseException');

/**
 * @param u {URL}
 * @param w {boolean}
 * @param pn {String[]}
 * @param dataDir {String}
 * @constructor
 */
function VisGene(u, w, pn, dataDir) {
    console.log(VisGene.notice);

    this.base = null;   /** {URL} of code directory */
    this.dataU = null;  /** {URL} of data directory */
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

VisGene.prototype = {
    constructor : VisGene,
    init : function(callback) {
        var vpU = null;
        try {
            // TODO: Don't hardcode in production
            vpU = url.parse("./index.html?data_url=test_data/test_data_01.txt");
            this.extAttrib = VPConnection.makeAttributes(vpU);
        } catch (e) {
            console.log("old-style VP connection failed, trying generic external connection (exception follows)");
            console.log(e.message);
            if (vpU !== null) {
                try {
                    this.extAttrib = ExternalConnection.makeExportAttributes(vpU);
                } catch (e2) {
                    console.log("external connection failed, resorting to load menu (exception follows)");
                    console.log(e2.message);
                }
            }
        }

        console.log("ExtAttributes: " + this.extAttrib);
        if (this.dataDir === null) {
            this.dataDir = VisGene.DEFAULT_DATA_DIR;
        }
        if (this.dataDir[this.dataDir.length-1] != "/") {
            this.dataDir += "/";
        }
        this.dataU = DataReader.makeURL(this.base, this.dataDir);

        // prepare data source
        this.src = new DataSource(this.dataU);
        var exp = new ExperimentList(url.resolve(this.dataU, "exper.txt"), url.resolve(this.dataU, "species.txt"), this.dataU, function() {
            this.exp = exp;
            this.run(callback);
        }.bind(this));

    },
    run : function(callback) {
        if (this.extAttrib !== null && this.extAttrib.get("sungearU") !== null) {
            this.src.setAttributes(this.extAttrib, this.dataU, function() {
                this.openFile(this.extAttrib, function() {
                    callback();
                });
            }.bind(this));

        }
    },

    openFile : function(attrib, callback) {
        console.log("data file: " + attrib.get("sungearU"));
        // var status = new StatusDialog(f, this);
        var t = new LoadThread(attrib);
        t.run(this, function() {
            if (t.getException() !== null) {
                console.log(t.getException());
            } else {
                var iL = attrib.get("itemsLabel", "items");
                var cL = attrib.get("categoriesLabel", "categories");
                // Set titles for geneF, geneM, goF, and goM
                var r = this.src.getReader();
                if (this.showWarning && r.missingGenes.size() + r.dupGenes.size() > 0) {
                    var msg = "There are inconsistencies in this data file:";
                    if (r.missingGenes.size() > 0) {
                        msg += "\n" + r.missingGenes.size() + " input " + iL + " unkown to Sungear have been ignored.";
                    }
                    if (r.dupGenes.size() > 0) {
                        msg += "\n" + r.dupGenes.size() + " " + iL + " duplicated in the input file; only the first occurence of each has been used.";
                    }
                    msg += "\nThis will not prevent Sungear from running, but you may want to resolve these issues.";
                    msg += "\nSee Help | File Info for details about the " + iL + " involved.";
                    console.log(msg);
                }
            }
            callback();
        }.bind(this));
    }
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
function LoadThread(attrib) {
    this.attrib = attrib;
    this.ex = null;
    this.status = null;
}

LoadThread.prototype = {
    constructor : LoadThread,
    run : function(parent, callback) {
        try {
            console.log("Preparing Sungear Display");
            parent.src.set(this.attrib, this.status, function() {
                console.log("done!");
            });
        } catch (oo) {
            if (typeof oo !== 'ParseException') {
                console.log("Out of memory?");
                // this.status.setModal(false);
                //parent.src.getReader().clear();
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

VisGene.VERSION = "1.2.0";
VisGene.DEFAULT_DATA_DIR = "data/";
VisGene.notice = "Copyright Chris Poultney, Radhika Mattoo, and Dennis McDaid 2016";
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
 * @callback {function}
 */
VisGene.main = function(args, callback) {
    try {
        var i = 0;
        var warn = true;
        var plugin = [];
        var dataDir = null;
        while (i < args.length && args[i][0] == "-" || args[i] == "demo") {
            if (args[i].localeCompare("--version") == 0) {
                console.log(VisGene.VERSION);
                i++;
            } else if (args[i] == "--usage" || args[i] == "--help") {
                this.usage();
                i++;
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
                i++;
            }
        }
        for (var j = i; j < args.length; j++) {
            plugin.push(args[j]);
        }
        var localUrl = url.format("./");
        var vis = new VisGene(localUrl, warn, plugin, dataDir);
        vis.init(function() {
            console.log("Made it back to vis init!");
            callback(vis);
        });
    } catch(mu) {
        console.error(mu);
    }
};

module.exports = VisGene;