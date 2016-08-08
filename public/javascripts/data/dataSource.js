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
const url = require('url');

const ParseException = require('./parseException');
const DataReader = require('./dataReader');
const SpeciesList = require('./speciesList');

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
    setAttributes : function(attrib, base, callback) {
        this.checkAttributes(attrib, base, function (response) {
            this.attrib = response;
            callback();
        });
    },
    /**
     * Get the attributes object.
     * @return {Attributes}
     */
    getAttributes : function() {
        return this.attrib;
    },
    /**
     * Verifies that a given attributes object contains the necessary basic attributes
     * (file name, species), and sets defaults when possible.
     * @param attrib the object to verify
     * @param base base URL for relative URLs
     * @throws IOException if a file cannot be read, or a file with no default location cannot be read
     * @throws ParseException if a file format issue is encountered
     */
    checkAttributes : function(attrib, base, callback) {
        if (attrib.get("sungearU") === null) {
            throw new ParseException("sungear file not specified");
        }
        // parse the sungear file header - may contain species, etc. data
        DataReader.readURL(attrib.get("sungearU"), function(response) {
            DataReader.parseHeader(response, attrib);
            var sp = null;
            // first check species file and defs
            var sn = attrib.get("species");
            if (sn !== null) {
                var speciesFile = attrib.get("speciesU");
                if (speciesFile === null) {
                    speciesFile = "species.txt";
                }
                var list = new SpeciesList(DataReader.makeURL(base, speciesFile), base);
                console.log("List: " + list);
                sp = list.getSpecies(sn);
                // if there's a species file, assume we're dealing with gene data
                if (attrib.get("itemsLabel") === null) {
                    attrib.put("itemsLabel", "genes");
                }
                if (attrib.get("categoriesLabel") === null) {
                    attrib.put("categoriesLabel", "GO Terms");
                }
            }
            // the check basic attribs
            if (attrib.get("geneU") == null) {
                attrib.put("geneU", (sp !== null) ? sp.geneU : DataReader.makeURL(base, DataSource.GENE_DEFAULT));
            }
            if (attrib.get("listU") == null) {
                attrib.put("listU", (sp !== null) ? sp.listU : DataReader.makeURL(base, DataSource.LIST_DEFAULT));
            }
            if (attrib.get("hierU") == null) {
                attrib.put("hierU", (sp !== null) ? sp.hierU : DataReader.makeURL(base, DataSource.HIER_DEFAULT));
            }
            if (attrib.get("assocU") == null) {
                attrib.put("assocU", (sp !== null) ? sp.assocU : DataReader.makeURL(base, DataSource.ASSOC_DEFAULT));
            }
            callback(attrib);
        });
    },

    /**
     * Gets the current default data directory.
     * @return the data directory
     */
    getDataDir : function() {
        return this.dataDir;
    },
    /**
     * Loads a new experiment by setting the attribute object and reading the files it specifies.
     * Read status updates are sent.
     * @param attrib the attributes object with new experiment information
     * @param status the object that should receive read status updates
     * @throws IOException on low-level file errors
     * @throws ParseException on Sungear-specific file format issues
     */
    set : function(attrib, status, callback) {
        if (typeof callback === 'undefined') {
            this.set(attrib, null, status);
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
                status.updateStatus("Reading Items List", 0);
            }
            if (this.geneSrc === null || this.geneSrc != geneU) {
                console.log("Attempting to readGenes:");
                this.reader.readGenes(geneU, function() {
                    console.log("Back from readGenes!");
                    this.geneSrc = geneU;
                    this.readTerms(listU, hierU, assocU, sungearU, function() {
                        console.log("Back!");
                    }.bind(this));
                }.bind(this));
            }
            if (status !== null) {
                status.updateStatus("Reading Categories", 1);
            }

            if (status !== null) {
                var iL = attrib.get("itemsLabel", "items");
                var cL = attrib.get("categoriesLabel", "categories");
                status.updateStatus("Reading " + cL + " / " + iL + " Associations", 2);
            }

            if (status !== null) {
                status.updateStatus("Reading Sungear Data", 3);
            }
        }
    },
    readTerms : function(listU, hierU, assocU, sungearU, callback) {
        console.log("Mmmmkay");
        console.log(this.glSrc);
        console.log(listU);
        if (this.glSrc === null || this.glSrc != listU || this.ghSrc === null || this.ghSrc != hierU) {
            this.reader.readTerms(listU, function() {
                console.log("back from readTerms!");
                this.glSrc = listU;
                this.readHierarchy(hierU, assocU, sungearU, function() {
                    callback();
                });
            }.bind(this));
        }
    },
    readHierarchy : function(hierU, assocU, sungearU, callback) {
        this.reader.readHierarchy(hierU, function() {
            console.log("back from readHierarchy!");
            this.ghSrc = hierU;
            this.readGeneToGo(assocU, sungearU, function() {
                callback();
            });
        }.bind(this));
    },
    readGeneToGo : function(assocU, sungearU, callback) {
        this.reader.readGeneToGo(assocU, function() {
            console.log("Back from Gene to Go!");
            this.ggSrc = assocU;
            this.readSungear(sungearU, function() {
                callback();
            });
        }.bind(this));
    },
    readSungear : function(sungearU, callback) {
        this.reader.readSungear(sungearU, function() {
            console.log("Back from SunGear");
            this.sunSrc = sungearU;
            callback();
        }.bind(this));
    },
    /**
     * Returns the current data reader
     * @return the data reader
     */
    getReader : function() {
        return this.reader;
    },
    accessMongo : function(callback) {
        this.reader.getMongoData('default', 'test_data_01', function() {
            callback();
        });
    }
};

// TODO: Add StatusDisplay?

module.exports = DataSource;