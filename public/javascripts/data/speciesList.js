const DataReader = require('./dataReader');
const ParseException = require('./parseException');

function SpeciesList(file, base) {
    this.parseSpecies(file, base);
}

SpeciesList.prototype = {
    constructor : SpeciesList,
    getSpecies : function(s) {
        for (var i = 0; i < this.species.length; i++) {
            var sp = this.species[i];
            if (sp.name == s) {
                return sp;
            }
        }
        throw new ParseException('Unknown species: "' + s + '"');
    },
    getAllSpecies : function() {
        return this.species;
    },
    parseSpecies : function(file, base) {
        DataReader.readURL(file, function(response) {
            var v = [];
            var line = DataReader.trimAll(DataReader.chop(response));
            for (var i = 0; i < line.length; i++) {
                try {
                    if (line[i][0] == '#' || line[i] == '') {
                        continue;
                    } else {
                        // TODO: Ensure this next line works.
                        var f = DataReader.trimAll(line[i].split(DataReader.SEP));
                        var desc = (f.length > 5 ? f[5] : "");
                        v.push(new Species(f[0], f[1], f[2], f[3], f[4], desc, base));
                    }
                } catch (e) {
                    console.error("error parsing species file at line: " + (i+1) + ", ignoring line (error follows)");
                    console.error("file: " + file);
                    console.error(e);
                }
            }
            this.species = v;
        }.bind(this));
    }
};

/**
 * @param name {String}
 * @param geneS {String}
 * @param listS {String}
 * @param hierS {String}
 * @param assocS {String}
 * @param desc {String}
 * @param base {URL}
 * @return {Species}
 */
SpeciesList.Species = function(name, geneS, listS, hierS, assocS, desc, base) {
    return new Species(name, geneS, listS, hierS, assocS, desc, base);
};

/**
 * @param name {String}
 * @param geneS {String}
 * @param listS {String}
 * @param hierS {String}
 * @param assocS {String}
 * @param desc {String}
 * @param base {URL}
 * @constructor
 */
function Species(name, geneS, listS, hierS, assocS, desc, base) {
    this.name = name;
    this.desc = desc;
    this.geneS = geneS;
    this.listS = listS;
    this.hierS = hierS;
    this.assocS = assocS;
    this.geneU = DataReader.makeURL(base, geneS);
    this.listU = DataReader.makeURL(base, listS);
    this.hierU = DataReader.makeURL(base, hierS);
    this.assocU = DataReader.makeURL(base, assocS);
}

module.exports = SpeciesList;