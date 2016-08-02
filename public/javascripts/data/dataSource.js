/**
 * Central repository for all data files pertaining to an experiment
 * (experiment file, gene description file, GO term file, GO hierarchy file, Go/gene association file).
 * The locations of these files are stored in the {@link #attrib} object,
 * which also contains any other information about the current experiment not
 * explicitly represented as a class field (see {@link Attributes} for details).
 * @author crispy & RajahBimmy
 * Copyright Chris Poultney 2004.
 */

const fs = require('fs');
const path = require('path');

const ParseException = require('./parseException');
const DataReader = require('./dataReader');

/**
 * Instantiates a new object with unknown file locations.
 * @param dataDir {URL}
 * @constructor
 */
function DataSource(dataDir) {
    this.dataDir = dataDir; /** Data directory for relative file locations */

    /** {URL}s */
    this.geneSrc = null;    /** Location of gene list file */
    this.glSrc = null;      /** Location of GO term list file */
    this.ghSrc = null;      /** Location of GO term hierarchy file */
    this.ggSrc = null;      /** Location of GO-to-gene association file */
    this.sunSrc = null;     /** Location of Sungear experimentfile */

    this.reader = null;     /** {DataReader} Reader object that performs actual file parsing */
    this.attrib = null;     /** {Attributes} Holds arbitrary information about the current experiment */

    // TODO: Remove, but this works!!!
    // var toFind = this.dataDir + "go-hier.txt";
    //
    
}

/** Default name of gene description file if none is given */
DataSource.GENE_DEFAULT = "annotation.txt.gz";
/** Default name of GO annotation file if none is given */
DataSource.LIST_DEFAULT = "go-annot.txt.gz";
/** Default name of GO hierarchy file if none is given */
DataSource.HIER_DEFAULT = "go-hier.txt.gz";
/** Default name of GO-to-gene association file if none is given */
DataSource.ASSOC_DEFAULT = "go2gene.txt.gz";

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
     * Sets the current attributes object; verifies the object entries first.
     * @param attrib {Attributes}
     * @param base base URL for relative URLs {URL}
     * @throws IOException on low-level file read and file not found errors
     * @throws ParseException on Sungear-specific file format errors
     */
    setAttributes : function(attrib, base) {
        this.checkAttributes(attrib, base);
        this.attrib = attrib;
    },
    getAttributes : function() {
        return this.attributes;
    },
    /**
     * Verifies that a given attributes object contains the necessary basic attributes
     * (file name, species), and sets defaults when possible.
     * @param attrib the object to verify
     * @param base base URL for relative URLs
     * @throws IOException if a file cannot be read, or a file with no default location cannot be read
     * @throws ParseException if a file format issue is encountered
     */
    checkAttributes : function(attrib, base) {
        if (attrib.get("sungearU") === null) {
            throw new ParseException("sungear file not specified");
        }
        // TODO: Finish implementation.
    },

    /**
     * Gets the current default data directory.
     * @return the data directory
     */
    getDataDir : function() {
        return this.dataDir;
    },
    set : function(attrib, status) {
        if (typeof status === 'undefined') {
            this.set(attrib, null);
        } else {
            var geneU = attrib.get("geneU");
            var listU = attrib.get("listU");
            var hierU = attrib.get("hierU");
            var assocU = attrib.get("assocU");
            var sungearU = attrib.get("sungearU");
            if (this.reader === null) {
                this.reader = new DataReader(attrib);
            } else {
                this.reader.setAttrib(attrib);
            }
            if (status !== null) {
                status.updateStatus("Reading Categories", 1);
            }
            if (this.glSrc === null || !(this.glSrc == listU) || this.ghSrc === null || !(this.ghSrc == hierU)) {
                this.reader.readTerms(listU);
            }
        }
    }
};

module.exports = DataSource;