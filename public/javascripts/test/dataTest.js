var fs = require('fs');
var path = require('path');
var ParseException = require('../data/parseException');
var Attributes = require('../data/attributes');

module.exports = {
    findDirectories : function() {
        return fs.readdirSync('./').filter(function(file) {
            return fs.statSync(path.join('./', file)).isDirectory();
        });
    },
    openWithFs : function() {
        // Synchronous read
        var data = fs.readFileSync('data/test_data_01.txt');
        return data.toString();
    },
    sayHello : function(){
        console.log("o shit whaddup.");
    },
    /** TEST WAS SUCCESSFUL */
    testParseException : function() {
        var arg1 = new ParseException("wow");
        var arg2 = new ParseException("oh", "hey");
        var arg3 = new ParseException("fuck", "these", "hoes");
        console.log(arg1.getLine());
        console.log(arg2.getLine());
        console.log(arg3.getLine());
    },
    // TODO: Finish Testing parseAttributes
    testAttributes : function() {
        var testAttributes = new Attributes();
        testAttributes.put("potato", "vodka");
        testAttributes.put("grapes", "wine");
        testAttributes.put("beets", "moonshine");

        console.log(testAttributes.get("potato"));
        testAttributes.remove("beets");
        var keys = testAttributes.getKeys();
        for (var i = 0; i < keys.length; i++) {
            console.log(keys[i]);
        }

        console.log(testAttributes.toString());
    }
};