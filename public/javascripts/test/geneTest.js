var Anchor = require('../genes/anchor');
var Gene = require('../genes/gene');
var MultiSelectable = require('../genes/multiSelectable');
var Vessel = require('../genes/Vessel');

module.exports = {
    sayHello : function(){
        console.log("hello!");
    },
    /** TEST WAS SUCCESSFUL */
    testAnchor : function(){
        var potato = new Anchor("potato");
        var tomato = new Anchor("tomato");
        console.log(potato.compare(tomato));
    },
    /** TEST WAS SUCCESSFUL */
    testGene : function() {
        var grey = new Gene("abcdefg", "a lot of fun around wolverine");
        var parmagean = new Gene("bluth", "private eye");
        var ation = [];
        for (var i = 0; i < 1000; i++) {
            ation[i] = 1.1 * i;
        }
        grey.setExp(ation);
        parmagean.setExp(ation);
        console.log(grey.compare(parmagean));
        console.log(grey.getExp()[111]);
        ation[111] = 0;
        console.log(grey.getExp()[111]);
        console.log(grey.toString());
    },
    /** TEST WAS SUCCESSFUL */
    testMultiSelectable : function() {
        console.log(MultiSelectable.UNION);
        console.log(MultiSelectable.INTERSECT);
    },
    /** TEST WAS SUCCESSFUL */
    testVessel : function() {
        var anchors = [];
        for (var i = 0; i < 10; i++) {
            anchors.push(new Anchor("potato" + i));
        }

        var myTest = new Vessel(anchors);

        for (var j = 0; j < 10; j++) {
            var title = "abc" + j;
            var x = new Gene(title, "a lot of fun.");
            myTest.addGene(x);
        }

        console.log(JSON.stringify(myTest));
        console.log(myTest.getFullCount());
        myTest.cleanup();
        console.log(myTest);
    }

};