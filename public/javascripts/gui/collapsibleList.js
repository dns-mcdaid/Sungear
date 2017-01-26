"use strict";
/**
 * CollapsibleList corresponds to the Genes Frame
 * @author RajahBimmy
 */

// TODO: Refactor all of this using react.js

const SortedSet = require('collections/sorted-set');

const GeneEvent = require('../genes/geneEvent');

/**
 * @param g {GeneList}
 * @constructor
 */
function CollapsibleList(g) {
    this.genes = g;
    this.lastRow = -1;
    this.model = new GeneModel(new SortedSet());
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
    this.geneFTable = document.getElementById('geneFTable');

    this.customBox = document.getElementById('customBox');

    // Difference between this and Java SunGear:
        // queryB opens a modal in both,
        // however querySubmit is added in this version
        // to actually handle the queries a person is searching for.
    this.queryDSubmit = document.getElementById('queryDSubmit');
    this.queryDLabel = document.getElementById('queryDLabel');
    this.queryA = document.getElementById('queryA');

    this.queryB.addEventListener("click", this.updateQueryDLabel.bind(this));
    this.queryDSubmit.addEventListener("click", this.queryGenes.bind(this));
    this.findF = document.getElementById('findF');
    this.findF.addEventListener('input', this.findSelectGenes.bind(this));
    this.findSelectB.addEventListener("click", this.findSelectGenes.bind(this));
    this.geneTBody.addEventListener('blur', this.tableChanged.bind(this));

    this.collapseT.addEventListener("click", this.setCollapsed.bind(this));
    this.collapsed = false;
    this.multi = false;

    this.populateTable();

    this.customBox.addEventListener("click", this.updateCustomSelect.bind(this));
}

CollapsibleList.prototype = {
    constructor : CollapsibleList,
    cleanup : function() {
        this.genes = null;
        this.model.cleanup();
        this.model = null;
        this.table = null;
    },
    queryGenes : function() {
        const v = this.queryA.value;
        if (v !== null) {
            const s = new SortedSet();
            const geneStrings = v.split("\n");
            geneStrings.forEach((geneString) => {
            	const g = this.genes.find(geneString);
	            if (typeof g !== 'undefined')
	            	s.push(g);
            });
            this.genes.setSelection(this, s);
        }
    },
    updateQueryDLabel : function() {
        this.queryDLabel.innerHTML = "Query " + this.genes.getSource().getAttributes().get("itemsLabel", "items");
        this.queryA.value = "";
    },
    setCollapsed : function() {
        this.collapsed = !this.collapsed;
        this.findF.value = "";
        this.updateList();
        this.populateTable();
        this.updateSelect();
    },
    setMulti : function(b) {
        this.multi = b;
        if (b == false) {
            // TODO: Clear Selection?
        }
    },
    updateList : function() {
        const t = new SortedSet();
	    //noinspection JSUnresolvedFunction
	    t.addEach(this.collapsed ? this.genes.getSelectedSet() : this.genes.getActiveSet());
        const prevData = this.model.getData();
        this.model.setGenes(t, this.genes.getSource().getAttributes().get("idLabel", "ID"));
	    // Perform a check to ensure the amount of data we're working with hasn't changed.
	    // In the event of a change, update the table cells.
        if (this.model.getData().length !== prevData) {
            this.populateTable();
        }
        this.updateSelect();
    },
	// TODO: Cut these next two functions down using react
    updateSelect : function() {
        this.updateStatus();
        const selGenes = this.genes.getSelectedSet().toArray();
        if (selGenes.length !== this.model.getData().length) {
            for (let i = 1; i < this.geneFTable.rows.length; i++) {
                this.geneFTable.rows[i].className = "faded";
            }
            const geneNames = selGenes.map(function(gene) {
                return gene.getName();
            });
            for (let i = 0; i < geneNames.length; i++) {
                const row = document.getElementById('gene-' + geneNames[i]);
                if (row !== null) {
                    row.className = "highlight";
                }
            }
        } else {
            for (let i = 1; i < this.geneFTable.rows.length; i++) {
                this.geneFTable.rows[i].className = "";
            }
        }
        let selectedString = '';
        for (let i = 0; i < selGenes.length; i++) {
            selectedString += '"' + selGenes[i].name + '","' + selGenes[i].desc + '"\n';
        }
        this.copyB.value = selectedString;
    },

    updateCustomSelect : function() {
        if (!this.customBox.checked) {
            this.updateSelect();
            return;
        }
        this.updateStatus();
        const selGenes = this.genes.getSelectedSet().toArray();
        if (selGenes.length !== this.model.getData().length) {
            for (let i = 1; i < this.geneFTable.rows.length; i++) {
                this.geneFTable.rows[i].className = "faded";
            }
            const geneNames = selGenes.map(function(gene) {
                return gene.getName();
            });
            for (let i = 0; i < geneNames.length; i++) {
                const row = document.getElementById('gene-' + geneNames[i]);
                if (row !== null) {
                    row.className = "highlight";
                }
            }
        } else {
            for (let i = 1; i < this.geneFTable.rows.length; i++) {
                this.geneFTable.rows[i].className = "";
            }
        }
        let selectedString = '';
        for (let i = 0; i < selGenes.length; i++) {
            selectedString += selGenes[i].name + '\n';
        }
        this.copyB.value = selectedString;
    },
    processSelect : function() {
        // TODO: Implement me.
    },

    updateGUI : function() {
        const iL = this.genes.getSource().getAttributes().get("itemsLabel", "items");
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
      if(this.findF.value != ""){
        const found = new SortedSet();
        const pattern = ".*" + this.findF.value + ".*";
        const p = new RegExp(pattern, "i");
      this.genes.getActiveSet().forEach((gene) => {
        if (p.test(gene.getName()) || p.test(gene.getDesc()))
          found.push(gene);
      });
        this.genes.setSelection(this, found);
      }else{
        this.genes.setSelection(this, this.genes.getActiveSet());
      }

    },
    /**
     * @param e {GeneEvent}
     */
    listUpdated : function(e) {
        switch (e.getType()) {
            case GeneEvent.NEW_LIST:
                this.updateGUI();
                this.updateList();
                this.populateTable();
                if (this.customBox.checked) {
                    this.updateCustomSelect();
                } else {
                    this.updateSelect();
                }
                break;
            case GeneEvent.RESTART:
            case GeneEvent.NARROW:
                this.updateList();
                break;
            case GeneEvent.SELECT:
                if (this.collapsed) {
                    this.updateList();
                } else if (this.customBox.checked) {
                    this.updateCustomSelect();
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
        // TODO: Implement me. Very similar to handle select.
    },
    updateStatus : function() {
        this.statusF.innerHTML = this.genes.getSelectedSet().length + " / " + this.genes.getActiveSet().length;
    },

	// TODO: Refactor these next two functions with react.js
    populateTable : function() {
        while (this.geneTBody.hasChildNodes()) {
            this.geneTBody.removeChild(this.geneTBody.firstChild);
        }
        const genes = this.model.getData();
        for (let i = 0; i < genes.length; i++) {
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

            row.id = 'gene-' + g.getName();

            this.geneTBody.appendChild(row);
            row.addEventListener('click', this.rowSelected.bind(this, row),false);
        }
    },
    rowSelected : function(cell) {
        const row = cell.rowIndex-1;
        if (row != -1 && !this.multi) {
            if (window.event.altKey) {
                this.genes.startMultiSelect(this);

                // TODO: Maybe keep track of this gene?
            } else {
                const g = this.model.getData()[row];
                let s = new SortedSet(this.genes.getSelectedSet());
                if (window.event.ctrlKey || window.event.metaKey) {
                    if (s.contains(g) ) {
                        s.remove(g);
                    } else {
                        s.push(g);
                    }
                } else if (this.lastRow != -1 && window.event.shiftKey) {
                    s.clear();
                    const start = Math.min(this.lastRow, row);
                    const end = Math.max(this.lastRow, row)+1;
                    s = s.union(this.model.getData().slice(start, end));
                } else {
                    s.clear();
                    s.push(g);
                    if (window.event.shiftKey) {
                        this.lastRow = row;
                    } else {
                        this.tableChanged();
                    }
                }
                this.genes.setSelection(this, s);
            }
        }
    },
    tableChanged : function() {
        this.lastRow = -1;
    },
    geneIsSelected : function(g){
      return this.selectionS.has(g);
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
    this.colComp = [];  /** {Array} of Comparison functions */
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
