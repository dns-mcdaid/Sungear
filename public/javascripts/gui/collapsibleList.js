/**
 * CollapsibleList corresponds to the Genes Frame
 * @author RajahBimmy
 */

require('javascript.util');
const TreeSet = javascript.util.TreeSet;

const GeneEvent = require('../genes/geneEvent');

const Gene = require('../genes/gene');

/**
 * @param g {GeneList}
 * @constructor
 */
function CollapsibleList(g) {
    this.genes = g;
    this.lastRow = -1;
    this.model = new GeneModel(new TreeSet());
    // RIP lines 89 - 99
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
    this.geneTBody = document.getElementById('geneTBody');

    // Difference between this and Java SunGear:
        // queryB opens a modal in both,
        // however querySubmit is added in this version
        // to actually handle the queries a person is searching for.
    this.queryDSubmit = document.getElementById('queryDSubmit');
    this.queryDLabel = document.getElementById('queryDLabel');
    this.queryA = document.getElementById('queryA');

    this.queryB.addEventListener("click", this.updateQueryDLabel.bind(this));
    this.queryDSubmit.addEventListener("click", this.queryGenes.bind(this));
    this.copyB.addEventListener("click", this.copyGenes.bind(this));
    this.findF = document.getElementById('findF');
    this.findF.addEventListener('input', this.findSelectGenes.bind(this));
    this.findSelectB.addEventListener("click", this.findSelectGenes.bind(this));
    this.geneTBody.addEventListener('blur', this.tableChanged.bind(this));
    // TODO: Check out this next one:
    //this.collapseT.addEventListener("click", this.setCollapsed.bind(this)/** TODO: Include Parameters */);
    this.collapsed = false;
    this.multi = false;

    // TESTING
    // console.log('Building genes...');
    // var myFirstGene = new Gene("AT1G01010", "A really fun gene A less fun gene A less fun gene A less fun gene");
    // var mySecondGene = new Gene("AT1G01020", "A less fun gene");
    // var myThirdGene = new Gene("AT1G66950", "The most fun gene");
    // var myTree = new TreeSet();
    // myTree.add(myThirdGene);
    // myTree.add(mySecondGene);
    // myTree.add(myFirstGene);
    // console.log(myTree);
    // console.log(this.model);
    // this.model.setGenes(myTree);
    // console.log(this.model);

    this.populateTable();
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
    setCollapsed : function(b) {
        this.collapsed = b;
        this.updateList();
    },
    setMulti : function(b) {
        this.multi = b;
        if (b == false) {
            // TODO: Clear Selection?
        }
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
        this.populateTable();
        this.updateSelect();
    },
    updateSelect : function() {
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
        var found = new TreeSet();
        var pattern = ".*" + this.findF.value + ".*";
        var p = new RegExp(pattern, "i");
        var activeArray = this.genes.getActiveSet().toArray();
        for (var it = 0; it < activeArray.length; it++) {
            var g = activeArray[it];
            if (p.test(g.getName()) || p.test(g.getDesc())) {
                found.add(g);
            }
        }
        this.genes.setSelection(this, found);
    },
    /**
     * @param e {GeneEvent}
     */
    listUpdated : function(e) {
        console.log("Collapsible updated!");
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
        this.statusF.innerHTML = this.genes.getSelectedSet().length + " / " + this.genes.getActiveSet().length;
    },
    populateTable : function() {
        while (this.geneTBody.hasChildNodes()) {
            this.geneTBody.removeChild(this.geneTBody.firstChild);
        }
        var genes = this.model.getData();
        for (var i = 0; i < genes.length; i++) {
            var g = genes[i];
            var row = document.createElement('tr');
            var idCell = row.insertCell(0);
            var descCell = row.insertCell(1);
            
            var descDiv = document.createElement('div');
            var descContent = document.createElement('div');
            var spaceDiv = document.createElement('div');
            var dotSpan = document.createElement('span');

            idCell.innerHTML = g.getName();
            descContent.innerHTML = g.getDesc();
            dotSpan.innerHTML = '&nbsp;';

            idCell.className = 'gene-id';
            descContent.className = 'td-content';
            spaceDiv.className = 'spacer';
            descDiv.className = 'td-container';

            descDiv.appendChild(descContent);
            descDiv.appendChild(spaceDiv);
            descDiv.appendChild(dotSpan);
            descCell.appendChild(descDiv);

            row.id = 'gene-' + i;

            this.geneTBody.appendChild(row);
            row.addEventListener('click', this.rowSelected.bind(this, row));
        }
    },
    rowSelected : function(cell) {
        var row = cell.rowIndex-1;
        if (row != -1 && !this.multi) {
            if (window.event.altKey) {
                this.genes.startMultiSelect(this);
                // TODO: Maybe keep track of this gene?
            } else {
                var g = this.model.getData()[row];
                var s = this.genes.getSelectedSet();
                if (window.event.ctrlKey || window.event.metaKey) {
                    if (s.contains(g)) {
                        s.remove(g);
                    } else {
                        s.push(g);
                    }
                } else if (this.lastRow != -1 && window.event.shiftKey) {
                    s.clear();
                    var start = Math.min(this.lastRow, row);
                    var end = Math.max(this.lastRow, row)+1;
                    s.union(this.model.getData().slice(start, end));
                } else {
                    s.clear();
                    s.push(g);
                    if (window.event.shiftKey) {
                        this.lastRow = row;
                    }
                }
                this.genes.setSelection(this, s);
            }
        }
    },
    tableChanged : function() {
        this.lastRow = -1;
    }
};

CollapsibleList.c1 = "#b0b0b0";
CollapsibleList.c2 = "#e8e8e8";
CollapsibleList.c3 = "#909090";

CollapsibleList.compareName = function(o1, o2) {
    return o1.getName().localeCompare(o2.getName());
};
CollapsibleList.compareDesc = function(o1, o2) {
    return o1.getDesc().localeCompare(o2.getDesc());
};

/**
 * @param data {SortedSet<Gene>}
 * @constructor
 */
function GeneModel(data) {
    this.titles = [ "ID", "Description" ];
    this.colComp = [];  /** {Vector<Comparator<Gene>>} */
    this.colComp.push(CollapsibleList.compareName);
    this.colComp.push(CollapsibleList.compareDesc);
    this.setGenes(data, "ID");
    this.comp = this.colComp[0];
    this.data.sort(this.comp);
}

GeneModel.prototype = {
    constructor : GeneModel,
    cleanup : function() {
        this.data = [];
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
        this.adjustColumnSizes();
    },
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
     * @param col {int}
     * @returns {Gene|String}
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