const DataReader = require('../data/dataReader');

function ExperimentList(experU, speciesU, base, callback) {
    this.parseExper(experU, function() {
        callback();
    }.bind(this));
}

ExperimentList.prototype = {
    constructor : ExperimentList,
    parseExper : function(u, callback) {
        // response.toString().split(/\|+|\n/);
        DataReader.readURL(u, function(response) {
            var v = [];
            var line = response.toString().split(/\n/);
            for (var i = 0; i < line.length; i++) {
                if (line[i][0] == '#') {
                    continue;
                }
                var f = DataReader.trimAll(line[i].split("|"));
                var sn = f.length > 3 ? f[3] : "arabidopsis";
                var at = f.length > 4 ? f[4] : null;
                v.push(new Experiment(f[0], f[1], f[2], sn, at));
            }
            this.exp = v;
            callback();
        }.bind(this));
    }
};

/**
 * @param id {String}
 * @param filename {String}
 * @param desc {String}
 * @param species {String}
 * @param attrib {String}
 * @constructor
 */
function Experiment(id, filename, desc, species, attrib) {
    this.id = id;
    this.filename = filename;
    this.desc = desc;
    this.species = species;
    this.attrib = attrib;
}

Experiment.prototype = {
    constructor : Experiment,
    getId : function() {
        return this.id;
    },
    getFilename : function() {
        return this.filename;
    },
    getDesc : function() {
        return this.desc;
    },
    getSpecies : function() {
        return this.species;
    },
    getAttribFile : function() {
        return this.attrib;
    },
    toString : function() {
        return this.id;
    }
};

module.exports = ExperimentList;