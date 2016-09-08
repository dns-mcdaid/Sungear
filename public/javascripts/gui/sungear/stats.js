"use strict";
const SortedSet = require('collections/sorted-set');

function Stats(genes, sun) {
    this.genes = genes;         /** {GeneList} */
    this.sun = sun;             /** {SunGear} */
    this.localUpdate = false;   /** {boolean} */
    this.model = new StatsModel(this);
    this.statsT = document.getElementById('statsTBody');
}

Stats.prototype = {
    constructor : Stats,
    update : function() {
        this.localUpdate = true;
        const hash = new Map();
        const vessels = this.sun.getVessels();
        for (let i = 0; i < vessels.length; i++) {
            if (vessels[i].getActiveCount() > 0) {
                const idx = vessels[i].anchor.length;
                let info = hash.get(idx);
                if (typeof info === 'undefined') {
                    info = new VesselInfo(idx);
                    hash.set(idx, info);
                }
                info.addVessel(vessels[i]);
            }
        }
        const it = hash.values();
        const valuesArray = [];

        // TODO: Refactor.
        let next = it.next();
        let finished = next.done;
        let nextValue = next.value;

        while(!finished) {
            valuesArray.push(nextValue);
            next = it.next();
            finished = next.done;
            nextValue = next.value;
        }

        this.model.update(valuesArray);
        this.localUpdate = false;
        this.populateTable();
    },
    selectStats : function(rows) {
        let s = new SortedSet();
        for (let i = 0; i < rows.length; i++) {
            s = s.union(this.model.getInfo(rows[i]).genes.toArray());
        }
        this.genes.setSelection(this, s);
    },
    populateTable : function() {
        while (this.statsT.hasChildNodes()) {
            this.statsT.removeChild(this.statsT.firstChild);
        }
        for (let i = 0; i < this.model.getRowCount(); i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < this.model.getColumnCount(); j++) {
                const colCell = row.insertCell(j);
                colCell.innerHTML = this.model.getValueAt(i, j);
            }
            this.statsT.appendChild(row);
            row.addEventListener('click', this.handleSelect.bind(this, row));
        }
    },
    handleSelect : function(row) {
        const rowInt = row.rowIndex-1;
        // TODO: Implement EventListener
    }
};

/**
 * @param parent {Stats}
 * @constructor
 */
function StatsModel (parent) {
    this.parent = parent;
    this.titles = ["anchors", "vessels", "genes"];
    this.vlist = [];
}

StatsModel.prototype = {
    constructor : StatsModel,
    /**
     * @param c {Array} of VesselInfo objects
     */
    update : function(c) {
        this.titles[2] = this.parent.genes.getSource().getAttributes().get("itemsLabel", "items");
        this.vlist = [];
        for (let i = 0; i < c.length; i++) {
            this.vlist.push(c[i]);
        }
        this.vlist.sort(); // This should work, as it calls VesselInfo's compareTo
    },
    getColumnName : function(col) {
        return this.titles[col];
    },
    getRowCount : function() {
        return this.vlist.length;
    },
    getColumnCount : function() {
        return this.titles.length;
    },
    getValueAt : function(row, column) {
        const info = this.vlist[row];
        switch (column) {
            case 0:
                return info.anchorCount;
            case 1:
                return info.vessels.length;
            case 2:
                return info.genes.length;
            default:
                return "";
        }
    },
    getInfo : function(row) {
        return this.vlist[row];
    }
};

function VesselInfo(cnt) {
    this.anchorCount = cnt; /** {number} int */
    this.vessels = [];
    this.genes = new SortedSet();
}

VesselInfo.prototype = {
    constructor : VesselInfo,
    addVessel : function(v) {
        this.vessels.push(v);
        const selected = v.selectedGenes.toArray();
        for (let i = 0; i < selected.length; i++) {
            this.genes.push(selected[i]);
        }
    },
    compareTo : function(o) {
        return this.anchorCount - o.anchorCount;
    },
    compare : function(o) {
        return this.anchorCount - o.anchorCount;
    }
};

module.exports = Stats;