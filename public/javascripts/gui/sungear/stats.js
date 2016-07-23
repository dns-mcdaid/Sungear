require('javascript.util');
var TreeSet = javascript.util.TreeSet;

function Stats(genes, sun) {
    this.genes = genes;         /** {GeneList} */
    this.sun = sun;             /** {SunGear} */
    this.localUpdate = false;   /** {boolean} */
    this.model = new StatsModel(this);
    this.statsT = document.getElementById('statsT');
    // TODO: add an event listener to the table.
}

Stats.prototype = {
    constructor : Stats,
    update : function() {
        this.localUpdate = true;
        var hash = {};
        var vessels = this.sun.getVessels();
        for (var i = 0; i < vessels.length; i++) {
            if (vessels[i].getActiveCount() > 0) {
                var idx = vessels[i].anchor.length;
                var info = hash[idx];
                if (info === null) {
                    hash[idx] = new VesselInfo(idx);
                }
                info.addVessel(vessels[i]);
            }
        }
        var keys = Object.keys(hash);
        var values = [];
        for (i = 0; i < keys.length; i++) {
            values.push(hash[keys[i]]);
        }
        this.model.update(values);
        this.localUpdate = false;
    },
    selectStats : function(rows) {
        var s = new TreeSet();
        // FIXME: Sloppy implementation.
        for (var i = 0; i < rows.length; i++) {
            var localGenes = this.model.getInfo(rows[i]).genes.toArray();
            for (var j = 0; j < localGenes.length; j++) {
                s.add(localGenes[j]);
            }
        }
        this.genes.setSelection(this, s);
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
    update : function(c) {
        this.titles[2] = this.parent.genes.getSource().getAttributes().get("itemsLabel", "items");
        this.vlist = [];
        for (var i = 0; i < c.length; i++) {
            this.vlist.push(c[i]);
        }
        this.vlist.sort(); // This should work, as it calls VesselInfo' compareTo
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
        var info = this.vlist[row];
        switch (column) {
            case 0:
                return info.anchorCount;
            case 1:
                return info.vessels.length;
            case 2:
                return info.genes.size();
            default:
                return "";
        }
    },
    getInfo : function(row) {
        return this.vlist[row];
    }
};

function VesselInfo(cnt) {
    this.anchorCount = cnt; /** {int} */
    this.vessels = [];      /** {Vector<VesselDisplay>} */
    this.genes = new TreeSet(); /** {TreeSet<Gene>} */
}

VesselInfo.prototype = {
    constructor : VesselInfo,
    addVessel : function(v) {
        this.vessels.push(v);
        var selected = v.selectedGenes.toArray();
        for (var i = 0; i < selected.length; i++) {
            this.genes.add(selected[i]);
        }
    },
    compareTo : function(o) {
        return this.anchorCount - o.anchorCount;
    }
};

module.exports = Stats;