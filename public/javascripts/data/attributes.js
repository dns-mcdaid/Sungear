/**
 * A simple Hashtable<String, Object> wrapper for named attributes associated with
 * an experiment.  The locations of required Sungear files are stored here, as well
 * as the current species.  Other attributes are stored here as well; these attributes
 * are stored, for example, by parsing the URL query string in {@link app.VisGene}.
 * They can also be included in the header portion of data files; each attribute is
 * specified on one line enclosed in braces, as below:<br>
 * <code>{ name = value }</code><br>
 * See <a href="http://virtualplant.bio.nyu.edu/public/docs/players.txt">the public documentation</a>
 * for an example.
 * A non-exhaustive list of known attributes follows:
 * <ul>
 * <li>itemsLabel: the item type of the current data (e.g., gene, player); replaces the generic &quot;Items&quot;
 * label of the item list window</li>
 * <li>categoriesLabel: the category type of the current hierarchy (e.g., GO Term, Team); replaces the generic
 * &quot;Category&quot; label of the hierarchy window</li>
 * <li>data_url: the URL from which an initial data file should be loaded (null by default)</li>
 * <li>export_url: the URL to which gene lists are exported using the Export button;
 * is null by default, and the export button will be inactive if this is null</li>
 * </ul>
 * @author crispy
 */

var DataReader = require('./dataReader');
var ParseException = require('./parseException');

/**
 * Constructs a new object with attributes derived from parsing the query string.
 * @param queryString the query string, usually the one used to open Sungear
 */
function Attributes(queryString) {
    this.attrib = {}; /** {Hashtable<String, Object>} Master hash table that stores all attributes */
    if (typeof queryString !== "undefined") {
        var nvp = queryString.split("\\&");
        var tempReader = new DataReader();
        for (var i = 0; i < nvp.length; i++) {
            var s = tempReader.trimAll(nvp[i].split("="));
            var v = (s.length > 1) ? s[1] : "";
            try {
                // TODO: Figure out which solution is better.
                this.attrib[s[0]] = decodeURIComponent(v);
                // this.attrib[s[0]] = decodeURI(v);
            } catch(e) {
                console.log("warning: unable to parse query string NVP, ignoring (error follows): " + s[0] + "=" + v);
                console.log(e);
            }
        }
    }
}

Attributes.prototype = {
    constructor : Attributes,
    /**
     * Parses the header of a file and adds any attributes specified there.
     * @param file the file to parse of type URL
     * @throws IOException on low-level file errors
     */
    parseAttributes : function(file) {
        var buf = DataReader.readURL(file);
        var line = buf.toString().split("\\n");
        for (var i = 0; i < line.length; i++) {
            try {
                if (line[i][0] == "#") {
                    continue;
                }
                var idx = line[i].indexOf(':');
                if (idx == -1) {
                    throw new ParseException("attribute error: improper format at line " + (i+1) + ": missing \":\"", line[i]);
                }
                var n = line[i].substring(0, idx).trim();
                var v = line[i].substring(idx+1).trim();
                // TODO: Ensure that a new ParseException is actually thrown
                if (n in this.attrib) {
                    throw new ParseException("attribute warning: ignoring duplicate key ("+n+") at line " + (i+1), line[i]);
                }
                this.attrib[n] = v;
            } catch(e) {
                if (typeof e !== ParseException) {
                    console.log("error parsing attributes file at line: " + (i+1) + ", ignoring line (error follows");
                    console.log("file: " + file);
                }
                console.log(e); // TODO: Refactor?
            }
        }
    },
    /**
     * Adds a new key/attribute pair.
     * @param key the new key
     * @param value the associated attribute
     * @return the old attribute associated with that key, or null if none
     */
    put : function(key, value) {
        var toReturn = this.attrib[key];
        this.attrib[key] = value;
        return (toReturn === null ? this.attrib[key] : toReturn);
    },
    /**
     * Removes a key/attribute pair.
     * @param key the key for the key/attribute pair to remove.
     * @return the attribute associated with the key, or null if none
     */
    remove : function(key) {
        delete this.attrib[key];
    },
    /**
     * Convenience method to get a attribute or, if the attribute is null,
     * a default value (saves lots of code repetition).
     * @param key the key whose associated attribute is desired
     * @param defaultValue the default value to return if the key is not mapped
     * @return the mapped attribute, or the default value if no mapped attribute
     */
    get : function(key, defaultValue) {
        if (typeof defaultValue !== 'undefined') {
            var o = this.attrib[key];
            return (o === null ? defaultValue : o);
        }
        return typeof this.attrib[key] !== 'undefined' ? this.attrib[key] : null;
    },
    /**
     * Returns all the attribute keys.
     * @return the set of keys
     */
    getKeys : function() {
        return Object.keys(this.attrib);
    },
    // TODO: Make sure absolutely nothing calls this for the love of God.
    toString : function() {
        return JSON.stringify(this.attrib);
    }
};

module.exports = Attributes;