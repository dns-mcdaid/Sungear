function Stats(genes, sun) {
    this.genes = genes;         /** {GeneList} */
    this.sun = sun;             /** {SunGear} */
    this.localUpdate = false;   /** {boolean} */
    this.model = new StatsModel();
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
        for (var i = 0; i < rows.length; i++) {
            // TODO: Finish this.
        }
    }
};

function StatsModel () {
    this.titles = ["anchors", "vessels", "genes"];
    this.vList = [];
}

StatsModel.prototype = {
    constructor : StatsModel,
    update : function(c) {
        this.titles[2]
    }
};

module.exports = Stats;