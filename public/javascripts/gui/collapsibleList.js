/**
 * CollapsibleList corresponds to the Genes Frame
 * @author RajahBimmy
 */

require('javascript.util');
var TreeSet = javascript.util.TreeSet;

var GeneEvent = require('../genes/geneEvent');

/**
 * @param g {GeneList}
 * @constructor
 */
function CollapsibleList(g) {
    this.genes = g;
    this.lastRow = -1;
    this.model = new GeneModel(new TreeSet());
    // RIP lines 89 - 99?
    this.statusF = document.getElementById('statusF');

    this.findSelectB = document.getElementById('findSelectB');
    this.collapseT = document.getElementById('collapseT');
    this.findSelectB.title = "Select all items matching the search text";
    this.collapseT.title = "Toggles collapsing list to selected items only";
    this.copyB = document.getElementById('copyB');
    this.queryB = document.getElementById('queryB');
    this.copyB.title = "Copy the currently selected items to the clipboard";
    this.queryB.title = "Search the active items using a query list";
    this.genes.addGeneListener(this);
    this.genes.addMultiSelect(this);

    // Difference between this and Java SunGear:
        // queryB opens a modal in both,
        // however querySubmit is added in this version
        // to actually handle the queries a person is searching for.
    this.queryDSubmit = document.getElementById('queryDSubmit');
    this.queryDLabel = document.getElementById('queryDLabel');
    this.queryA = document.getElementById('queryA');

    // TODO: Implement a custom EventListener which can be applied to each row of the table individually.
    this.queryB.addEventListener("click", this.updateQueryDLabel.bind(this));
    this.queryDSubmit.addEventListener("click", this.queryGenes.bind(this));
    this.copyB.addEventListener("click", this.copyGenes.bind(this));
    // this.findSelectB.addEventListener("click", this.findSelectGenes.bind(this));
    // this.collapseT.addEventListener("click", this.setCollapsed.bind(this)/** TODO: Include Parameters */);
    this.collapsed = false;
}

CollapsibleList.prototype = {
    constructor : CollapsibleList,
    cleanup : function() {
        this.genes = null;
        this.model.cleanup();
        this.model = null;
        this.table = null;
    },
    lostOwnership : function(c, t) {
        return;
    },
    copyGenes : function() {
        // TODO: Find a .js package which grants access to the clipboard.
        console.log("Might work!");
    },
    queryGenes : function() {
        var v = this.queryA.value;
        if (v !== null) {
            var s = new TreeSet();
            var gene = v.split("\n");
            for (var i = 0; i < gene.length; i++) {
                var g = this.genes.find(gene[i]);
                if (g !== null) {
                    s.add(g);
                }
            }
            this.genes.setSelection(this, s);
        }
    },
    updateQueryDLabel : function() {
        var msg = "Query " /** TODO: + this.genes.getSource().getAttributes().get("itemsLabel", "items")*/;
        this.queryDLabel.innerHTML = msg;
        this.queryA.value = "";
    },
    updateList : function() {
        var t = new TreeSet();
        if (this.collapsed) {
            var selArray = this.genes.getSelectedSet().toArray();
            for (var i = 0; i < selArray.length; i++) {
                t.add(selArray[i]);
            }
        } else {
            var actArray = this.genes.getActiveSet().toArray();
            for (var j = 0; j < actArray.length; j++) {
                t.add(actArray[j]);
            }
        }
        this.model.setGenes(t, this.genes.getSource().getAttributes().get("idLabel", "ID"));
        this.updateSelect();
    },
    updateSelect : function() {
        // TODO: table.repaint?
        this.updateStatus();
    },
    processSelect : function() {
        // TODO: Implement me.
    },
    updateGUI : function() {
        var iL = this.genes.getSource().getAttributes().get("itemsLabel", "items");
        this.findSelectB.title = "Select all " + iL + " matching the search text";
        this.collapseT.title = "Toggles collapsing list to selected " + iL + " only";
        this.queryB.title = "Search the active " + iL + " using a query list";
        this.copyB.title = "Copy the currently selected " + iL + " to the clipboard";
    },
    /**
     * Sets the selected set to all genes matching the string
     * in the search field.
     */
    findSelectGenes : function() {
        // TODO: Implement me
    },
    /**
     * @param e {GeneEvent}
     */
    listUpdated : function(e) {
        switch (e.getType()) {
            case GeneEvent.NEW_LIST:
                this.updateGUI();
                this.updateList();
                this.updateSelect();
                break;
            case GeneEvent.RESTART:
                break;
            case GeneEvent.NARROW:
                this.updateList();
                break;
            case GeneEvent.SELECT:
                if (this.collapsed) {
                    this.updateList();
                } else {
                    this.updateSelect();
                }
                break;
            case GeneEvent.MULTI_START:
                this.setMulti(true);
                break;
            case GeneEvent.MULTI_FINISH:
                this.setMulti(false);
                break;
            default:
                break;
        }
    },
    getMultiSelection : function(operation) {
        // TODO: Implement me
    },
    updateStatus : function() {
        this.statusF.innerHTML = this.genes.getSelectedSet().size() + " / " + this.genes.getActiveSet().size();
    }
};

CollapsibleList.c1 = "#b0b0b0";
CollapsibleList.c2 = "#e8e8e8";
CollapsibleList.c3 = "#909090";

function CompareName() { }
CompareName.prototype.compare = function(o1, o2) {
    return o1.getName().localeCompare(o2.getName());
};
function CompareDesc() { }
CompareDesc.prototype.compare = function(o1, o2) {
    return o1.getDesc().localeCompare(o2.getDesc());
};

/**
 * @param data {SortedSet<Gene>}
 * @constructor
 */
function GeneModel(data) {
    this.titles = [ "ID", "Description" ];
    this.colComp = [];
    this.colComp.push(new CompareName());
    this.colComp.push(new CompareDesc());
    this.setGenes(data, "ID");
    this.comp = this.colComp[0];
    this.data.sort(this.comp.compare);
}

GeneModel.prototype = {
    constructor : GeneModel,
    cleanup : function() {
        this.data = null;
        this.colComp = null;
        this.comp = null;
    },
    setSortColumn : function(col) {
        if (col < this.colComp.length) {
            if (this.comp != this.colComp[col]) {
                this.comp = this.colComp[col];
                this.doSort();
            }
        }
    },
    indexOf : function(g) {
        return this.data.indexOf(g);
    },
    doSort : function() {
        this.data.sort(this.comp);
        this.updateSelect();
    },
    getComparator : function() {
        return this.comp;
    },
    getData : function() {
        return this.data;
    },
    setGenes : function(sel, lab) {
        this.data = sel.toArray();
        this.titles[0] = lab;
        this.data.sort(this.comp);
        // Two lines here. Necessary? Ehhhhhhhhhhh
        this.adjustColumnSizes();
    },
    /**
     * TODO: Find out a way to get GeneModel to access CollapsibleList's data.
     */
    adjustColumnSizes : function() {

    },
    getColumnName : function(col) {
        return this.titles[col];
    },
    getRowCount : function() {
        return this.data.length;
    },
    getColumnCount : function() {
        return 2;
    },
    /**
     * TODO: Fix this shit so it gets the class, or find out if it's necessary?
     * @param col {int}
     * @returns {*}
     */
    getColumnClass : function(col) {
        return this.getValueAt(0, col);
    },
    getValueAt : function(row, column) {
        switch (column) {
            case 0:
                return this.data[row];
            case 1:
                return this.data[row].getDesc();
            default:
                return null;
        }
    }

};

module.exports = CollapsibleList;