/**
 * Top-level GUI component for Sungear.  Can be instantiated
 * as an applet or an application.
 *
 * @author crispy
 */

var DataReader = require('../data/dataReader');
var DataSource = require('../data/dataSource');

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
        
        // build GUI
        this.desk = document.createElement("div");
        this.desk.id = "desk";

        var bar = document.createElement("div");
        bar.id = "navbar";

        var fileM = document.createElement("div");
        fileM.id = "fileM";
        fileM.class = "label";  // TODO: Maybe change?

        var fileBtn = document.createElement("button");
        fileBtn.innerHTML = "File";

        var loadI = document.createElement("a");
        var screenI = document.createElement("a");
        loadI.innerHTML = "Load...";
        screenI.innerHTML = "Screen Shot";
        // TODO: @Dennis add keyboard shortcuts.

        var fileDropDown = document.createElement("div");
        fileDropDown.class = "dropdown-content";
        fileDropDown.appendChild(loadI);
        fileDropDown.appendChild(screenI);

        fileM.appendChild(fileBtn);
        fileM.appendChild(fileDropDown);
        bar.appendChild(fileM);
        this.desk.appendChild(bar);
        document.body.appendChild(this.desk);
    }

};