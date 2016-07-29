const DataReader = require('../data/dataReader');

/**
 * @param experU {URL}
 * @param speciesU {URL}
 * @param base {URL}
 * @param par
 * @constructor
 */
function ExperimentList(experU, speciesU, base, par) {
    this.parent = par;  /** @type Container */
    this.exp = this.parseExper(experU); /** @type Vector <Experiment> */
    this.exp = [];
    this.model = new ExperModel(this.exp);
    this.files = document.getElementById('loadTable');
    this.files.style.cursor = "default";
    this.populateTable();

    // this.adjustColumnSize(0);
    // this.adjustColumnSize(2);
    // this.openB = document.getElementById('openB');
    // this.openB.addEventListener("click", this.handleSelect.bind(this));

    this.selection = null;
    $('#loadTable').on('click', 'tbody tr', function(event) {
        $(this).addClass('highlight').siblings().removeClass('highlight');
    });
}

ExperimentList.prototype = {
    constructor : ExperimentList,

    // Unnecessary function.
    // adjustColumnSize : function(c) { },

    handleSelect : function(row) {
        var rowInt = row.rowIndex-1;
        this.selection = null;
        if (rowInt != -1) {
            this.selection = this.model.getValueAt(rowInt, 0);
            console.log(this.selection);
        }
    },

    getSelection : function() {
        return this.selection;
    },
    /**
     * @param u {URL}
     * @returns {Array} of Experiments
     */
    parseExper : function(u) {
        var v = [];
        var buf = DataReader.readURL(u);
        var line = buf.toString().split("\\n");
        for (var i = 0; i < line.length; i++) {
            try {
                if (line[i][0] == "#") {
                    continue;
                }
                var f = DataReader.trimAll(line[i].split("\\|"));
                var sn = f.length > 3 ? f[3] : "arabidopsis";
                var at = f.length > 4 ? f[4] : null;
                v.push(new Experiment(f[0], f[1], f[2], sn, at));
            } catch (e) {
                console.error("error parsing experiment file at line: " + (i+1));
                console.error("file: " + u);
                console.error(e);
            }
        }
        return v;
    },
    populateTable : function() {
        for (var i = 0; i < this.exp.length; i++) {
            var e = this.exp[i];
            var row = document.createElement('tr');
            var nameCell = row.insertCell(0);
            var descCell = row.insertCell(1);
            var specCell = row.insertCell(2);
            nameCell.innerHTML = e.getFilename();
            descCell.innerHTML = e.getDesc();
            specCell.innerHTML = e.getSpecies();
            row.id = 'experiment-' + i;
            this.parent.appendChild(row);
            row.addEventListener('click', this.handleSelect.bind(this, row));
        }
    }
};

function ExperModel(data) {
    this.data = data.slice();   /** {Vector<Experiment>} */
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
     * @param row {int}
     * @param column {int}
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