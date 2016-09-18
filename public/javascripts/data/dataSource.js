/**
 * Central repository for all data files pertaining to an experiment
 * (experiment file, gene description file, GO term file, GO hierarchy file, Go/gene association file).
 * The locations of these files are stored in the {@link #attrib} object,
 * which also contains any other information about the current experiment not
 * explicitly represented as a class field (see {@link Attributes} for details).
 * @author RajahBimmy
 * @java-author Crispy
 */

const Attributes = require('./attributes');
const SpeciesList = require('./speciesList');

/**
 * Instantiates a new object with unknown file locations.
 * @param dataDir {URL}
 * @constructor
 */
function DataSource(dataDir) {
    this.dataDir = dataDir; /** Data directory for relative file locations */

    this.reader = null;     /** {DataReader} Reader object that performs actual file parsing */
    this.attrib = new Attributes();     /** {Attributes} Holds arbitrary information about the current experiment */
}

DataSource.prototype = {
    constructor : DataSource,
    /**
     * Frees up resources for garbage collection.
     */
    cleanup : function() {
        this.reader = null;
        this.attrib = null;
    },
    /**
     * Get the attributes object.
     * @return {Attributes}
     */
    getAttributes : function() {
        return this.attrib;
    },

    /**
     * Gets the current default data directory.
     * @return the data directory
     */
    getDataDir : function() {
        return this.dataDir;
    },
    /**
     * Returns the current data reader
     * @return the data reader
     */
    getReader : function() {
        return this.reader;
    },
    setReader : function(reader) {
        this.reader = reader;
    }
};

// TODO: Add StatusDisplay?

module.exports = DataSource;