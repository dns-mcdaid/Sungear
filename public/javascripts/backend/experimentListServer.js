const DataReader =

function ExperimentList(experU, speciesU, base, par) {
    this.parent = par;
    this.exp = this.parseExper(experU);
}

ExperimentList.prototype = {
    constructor : ExperimentList,
    parseExper : function(u) {
        var v = [];
        var buf = DataReader.readURL(u);
        var line = buf.toString().split("\\n");
        console.log(line);
    }
};

module.exports = ExperimentList;