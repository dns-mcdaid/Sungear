var Attributes = require('../data/attributes');
var DataReader = require('../data/dataReader');

function GOBrowser(base, annot, hier) {
    if (typeof base === 'undefined') {
        this.base = null;
    } else {
        this.base = base;
        this.annot = annot;
        this.hier = hier;
    }
}

GoBrowser.prototype = {
    constructor : GOBrowser,
    init : function() {
        var browser = new BrowserPanel(this.base, this.annot, this.hier);
        // TODO: @Dennis add lines 65 - 66
    },
    main : function(args) {
        var f = document.createElement("div");
        if (args.toArray().length > 2) {
            console.log("usage: GOBrowser {annot-file} {hier-file}");
        }
        var browser = new GOBrowser("./", args[0], args[1]);
        f.appendChild(browser);
        f.id = "GOBrowser";
        f.class = "GOBrowser";
        browser.init();
    }
};

/**
 * Simple stand-alone GO term browser.  Uses static methods in
 * {@link data.DataReader} to read the GO term descriptions and
 * relationships.
 *
 * @param base {URL}
 * @param annot {String}
 * @param hier {String}
 */
function BrowserPanel(base, annot, hier) {
    // read data
    this.terms = new Map();    /** {Hashtable<String,Term>} */
    var attrib = new Attributes();
    var tempReader = new DataReader();
    tempReader.readTerms(tempReader.makeURL(base, annot), this.terms, attrib);
    this.roots = [];    /** {Vector<Term>} roots */
    tempReader.readHierarchy(DataReader.makeURL(base, hier), this.terms, this.roots, attrib);
    // build tree
    this.tree = document.createElement("div");  /** {JTree} */
    // TODO: @Dennis implement lines 118 - 120
    this.terms.forEach((value, key) => {
    	value.setActive(true);
    });
    // TODO: @Dennis implement lines 126 - 173
    // Add Event Listeners
}

BrowserPanel.prototype = {
    constructor : BrowserPanel,
    /**
     * Populate popup menu with terms matching search string.
     */
    findMatches : function() {
        var p = new RegExp(".*"+this.findT.value+".*", "i");
        var v = [];
        for (var i = 0; i < this.nodes.length; i++) {
            var t = this.nodes[i];
            if (p.test(t.getName())) {
                v.push(t)
            }
        }
        // TODO: Update the findL list to reflect the search results.
        this.statusT.innerHTML = "Matches: " + v.length;
    },
    /**
     * @param n {DefaultMutableTreeNode}
     */
    showNode : function(n) {
        this.lastNode = n;
    },
    /**
     * Resets the find menu state, forcing a new search for matching terms.
     */
    resetFind : function() {
        this.lastNode = null;
    },
    /**
     * Makes the display tree from the DAG by duplicating subtrees with
     * multiple parents.
     */
    makeTreeFromDAG : function() {
        this.nodes = [];
        var root = null; // TODO: @Dennis fix
        for (var i = 0; i < this.roots.length; i++) {
            this.addNodes(root, this.roots[i]);
        }
        // TODO: @Dennis maybe implement line 213?
    },
    /**
     * Recursively adds GO terms to the display tree.
     * @param r parent node in tree
     * @param n child node to add to tree at parent
     */
    addNodes : function(r, n) {
        if (n.isActive()) {
            // TODO: @Dennis write/find a js substitution to DefaultMutableTree
        }
    },
    getShortPath : function(n) {
        var an = null;
        var af = null;

    }
};

module.exports = GOBrowser;