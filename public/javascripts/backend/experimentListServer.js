const DataReader = require('../data/dataReader');

function ExperimentList(experU, speciesU, base, par) {
    this.parent = par;
    this.son = "Potato";
    this.parseExper(experU);
}

ExperimentList.prototype = {
    constructor : ExperimentList,
    parseExper : function(u) {
        this.exp = DataReader.readURL(u).then(function(response) {
            var v = [];
            var line = response.toString().split(/\|+|\n/);
            return line;
            // for (var i = 0; i < line.length; i++) {
            //     console.log(line[i].trim());
            // }
        }.bind(this));
    }
};

module.exports = ExperimentList;