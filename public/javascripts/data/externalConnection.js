/**
 * Parses the provided query string, and makes relevant attributes
 * available in the returned object.
 * If the query string includes the name data_url, Sungear will try to parse its value as a URL,
 * and look at that location for a valid input file.  Similarly, if the name export_url is provided,
 * Sungear will try to parse it value as a URL, and enable data export to that location.
 * Any other NVPs in the query string are added to the attributes, and those whose names
 * start with export_ will be added to the form post for the export.
 * @param document the URL with which Sungear was launched, including query string
 * @return an Attributes object containing the query string values
 * @throws ParseException if export_url is invalid or missing
 */

const url = require('url');

const Attributes = require('./attributes');
const DataReader = require('./dataReader');
const ParseException = require('./parseException');

function makeExportAttributes(doc) {
    var qs = doc.query;
    if (qs === null || typeof qs === 'undefined') {
        throw new ParseException("no query data");
    }
    var attrib = new Attributes(qs);
    try {
        attrib.put("sungearU", DataReader.makeURL(doc, decodeURIComponent(attrib.get("data_url"))));
    } catch (e) {
        console.error("Warning: external data unavailable (data_url not set or not a URL)");
    }
    try {
        attrib.put("export_url", DataReader.makeURL(doc, decodeURIComponent(attrib.get("export_url"))));
    } catch (e) {
        console.error("warning: invalid export URL provided, export function unavailable");
    }
    return attrib;
}

module.exports = {
    makeExportAttributes : makeExportAttributes
};