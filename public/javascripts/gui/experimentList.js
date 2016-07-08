function ExperimentList(experU, speciesU, base, par) {
    this.parent = par;  /** @type Container */
    this.exp = this.parseExper(experU); /** @type Vector <Experiment> */
    this.setLayout(document.getElementById('experimentList'));
    this.files = new ExperModel(exp); // TODO: @Dennis check this against JTable
    this.adjustColumnSize(0);
    this.adjustColumnSize(2);
    // TODO: @Dennis finish implementation.
}

ExperimentList.prototype = {

};

function ExperModel(data) {
    this.data = data.slice();   /** @type Vector<Experiment> data */
    this.titles = ["Name", "Description", "Species"];
}

ExperModel.prototype = {
    constructor : ExperModel,
    getColumnName : function(col) {
        return this.titles[col];
    },
    getRowCount : function() {
        return this.data.length;
    },
    getColumnCount : function() {
        return this.titles.length;
    },
    /**
     * @param row of type int
     * @param column of type int
     */
    getValueAt : function(row, column) {
        switch(column) {
            case 0:
                return this.data[row];
            case 1:
                return this.data[row].getDesc();
            case 2:
                return this.data[row].getSpecies();
            default:
                return "";
        }
    }
};

/**
 * @param id of type String
 * @param filename of type String
 * @param desc of type String
 * @param species of type String
 * @param attrib of type String
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