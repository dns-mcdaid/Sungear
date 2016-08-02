const url = require('url');

const ExperimentList = require('./experimentListServer');

const Attributes = require('../data/attributes');
const DataReader = require('../data/dataReader');
const DataSource = require('../data/dataSource');
const ExternalConnection = require('../data/externalConnection');
const VPConnection = require('../data/vpConnection');

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
            vpU = url.format("./index.html?sungearU=");
            this.extAttrib = VPConnection.makeAttributes(vpU);
        } catch (e) {
            console.error("old-style VP connection failed, trying generic external connection (exception follows)");
            console.error(e.message);
            if (vpU !== null) {
                try {
                    this.extAttrib = ExternalConnection.makeExportAttributes(vpU);
                } catch (e2) {
                    console.error("external connection failed, resorting to load menu (exception follows)");
                    console.error(e2.message);
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
        console.log(this.dataU);

        var potato =  function(callback) {
            DataReader.testRequest(function() {
                callback();
            });
            callback();
        };

        // prepare data source
        //this.src = new DataSource(this.dataU);
        var exp = new ExperimentList(url.resolve(this.dataU, "exper.txt"), url.resolve(this.dataU, "species.txt"), this.dataU, function() {
            this.exp = exp;
            potato(callback);
        }.bind(this));

    },
    run : function() {
        if (this.extAttrib !== null && this.extAttrib.get("sungearU") !== null) {
            this.src.setAttributes(this.extAttrib, this.dataU);
            this.openFile();
        }
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
        var myUrl = url.format("./");
        console.log(myUrl);
        var vis = new VisGene(myUrl, warn, plugin, dataDir);
        vis.init(function() {
            console.log("Made it back to vis init!");
            callback(vis);
        });
    } catch(mu) {
        console.error(mu);
    }
};

module.exports = VisGene;