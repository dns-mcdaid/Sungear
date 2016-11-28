"use strict";
/**
 * A simple Map (String => Object) wrapper for named attributes associated with
 * an experiment.  The locations of required SunGear files are stored here, as well
 * as the current species.  Other attributes are stored here as well; these attributes
 * are stored, for example, by parsing the URL query string in VisGene.
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
 *
 * As an aside, I'm sure the above text looks a lot better in Eclipse's JavaDoc than the way it does right now in WebStorm.
 *
 * @author RajahBimmy
 * @java-author Crispy
 */

const DataReader = require('./dataReader');

/**
 * Constructs a new object with attributes derived from parsing the query string.
 * @param queryString the query string, usually the one used to open SunGear
 */
function Attributes(queryString) {
    this.attrib = new Map(); /** {Map} stores all attributes (String => Object) */
    if (typeof queryString !== "undefined") {
        const nvp = queryString.split("&");
        nvp.forEach((piece) => {
        	const s = DataReader.trimAll(piece.split("="));
	        const v = (s.length > 1) ? s[1] : "";
	        this.attrib.set(s[0], decodeURIComponent(v)); 
        });
    }
}

Attributes.prototype = {
    constructor : Attributes,
    /**
     * Adds a new key/attribute pair.
     * @param key the new key
     * @param value the associated attribute
     * @return the old attribute associated with that key, or null if none
     */
    put : function(key, value) {
        const oldValue = this.attrib.get(key);
        this.attrib.set(key, value);
        return (typeof oldValue === 'undefined' ? null : oldValue);
    },
    /**
     * Removes a key/attribute pair.
     * @param key the key for the key/attribute pair to remove.
     * @return the attribute associated with the key, or null if none
     */
    remove : function(key) { this.attrib.delete(key); },
    /**
     * Convenience method to get a attribute or, if the attribute is null,
     * a default value (saves lots of code repetition).
     * @param key the key whose associated attribute is desired
     * @param defaultValue the default value to return if the key is not mapped
     * @return the mapped attribute, or the default value if no mapped attribute
     */
    get : function(key, defaultValue) {
    	if (typeof defaultValue === "undefined") defaultValue = null;
        return this.attrib.has(key) ? this.attrib.get(key) : defaultValue;
    },
    /**
     * Returns all the attribute keys.
     * @return {Iterator} on the Map's keys.
     */
    getKeys : function() { return this.attrib.keys(); },
	/**
	 * Iterates over all key value pairings in the map and returns a string of them.
	 * @returns {string}
	 */
    toString : function() {
    	let msg = "";
    	this.attrib.forEach((value, key) => {
    		msg += key + " => " + value + "\n";
	    });
	    return msg;
    }
};

module.exports = Attributes;
