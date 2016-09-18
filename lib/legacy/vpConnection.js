const url = require('url');

const Attributes = require('./attributes');
const DataReader = require('./dataReader');
const ParseException = require('./parseException');

function makeAttributes(doc) {
    var queryString = doc.query;
    console.log(queryString);
    if (queryString === null || typeof queryString === 'undefined') {
        throw new ParseException("no query data");
    }
    var attrib = new Attributes(queryString);
    if (attrib.get("session_id") === null || typeof attrib.get("session_id") === 'undefined') {
        throw new ParseException("missing required attribute: session_id");
    }
    attrib.put("export_session_id", attrib.get("session_id"));
    attrib.remove("session_id");
    try {
        attrib.put("sungearU", DataReader.makeURL(doc, decodeURIComponent(attrib.get("data_url"))));
    } catch (e) {
        throw new ParseException("required attribute missing or incorrect: data_url");
    }
    try {
        attrib.put("export_url", DataReader.makeURL(doc, decodeURIComponent(attrib.get("vp_url"))));
    } catch (e) {
        throw new ParseException("required attribute missing or incorrect: vp_url");
    }
    attrib.put("export_action", "session");
    attrib.put("export_cmd", "addGroups");
    return attrib;
}

module.exports = {
    makeAttributes : makeAttributes
};