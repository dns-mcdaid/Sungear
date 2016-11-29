"use strict";
/**
 * The Controls class contains the buttons which belong to the controlF panel.
 * They then call actions on a given GeneList
 */

const SortedSet = require('collections/sorted-set');

const GeneEvent = require('../genes/geneEvent');
const MultiSelectable = require('../genes/multiSelectable');
const CoolVessel = require("./sungear/comp").CoolVessel;

/**
 * @param gn {GeneList}
 * @param el {ExportList}
 * @constructor
 */
function Controls(gn, el) {
    this.genes = gn;
    this.gear = null;
    this.export = el;
    this.coolMethod = 0;
    this.cool = [];

    this.restartB = document.getElementById('restartB');
    this.restartB.title = "Work with the original active set";
    this.restartB.addEventListener("click", this.runRestart.bind(this));
    this.restartB.className = Controls.ENABLED;

    this.allB = document.getElementById('allB');
    this.allB.title = "Select all items";
    this.allB.addEventListener("click", this.runAll.bind(this));
    this.allB.className = Controls.ENABLED;

    this.noneB = document.getElementById('noneB');
    this.noneB.title = "Unselect all items";
    this.noneB.addEventListener("click", this.runNone.bind(this));
    this.noneB.className = Controls.ENABLED;

    this.backB = document.getElementById('backB');
    this.backB.title = "Go back to the previous selected set";
    this.backB.addEventListener("click", this.runBack.bind(this));
    this.backB.className = Controls.DISABLED;

    this.forwardB = document.getElementById('forwardB');
    this.forwardB.title = "Go forward to the next selected set";
    this.forwardB.addEventListener("click", this.runForward.bind(this));
    this.forwardB.className = Controls.DISABLED;

    this.narrowB = document.getElementById('narrowB');
    this.narrowB.title = "Restrict the active set to the current selected set";
    this.narrowB.addEventListener("click", this.runNarrow.bind(this));
    this.narrowB.className = Controls.ENABLED;

    this.unionB = document.getElementById('unionB');
    this.unionB.title = "Set the selected set to the union of all selected items";
    this.unionB.addEventListener("click", this.runUnion.bind(this));
    this.unionB.className = Controls.DISABLED;

    this.intersectB = document.getElementById('intersectB');
    this.intersectB.title = "Set the selected set to the intersect of all selected items";
    this.intersectB.addEventListener("click", this.runIntersect.bind(this));
    this.intersectB.className = Controls.DISABLED;

    this.coolM = document.getElementById('coolM');
    this.coolB = document.getElementById('coolB');
    this.coolB.addEventListener("click", this.runCool.bind(this));
    this.coolB.className = Controls.ENABLED;

    this.setCoolState();
    this.genes.addGeneListener(this);
}

Controls.ENABLED = "btn btn-primary";
Controls.DISABLED = "btn btn-primary disabled";
Controls.DROPDOWN = "dropdown-toggle";

Controls.prototype = {
    constructor : Controls,
    cleanup : function() {
        this.genes = null;
        this.cool = null;
    },
    getPreferredSize : function() {
        // TODO: Implement? May be unnecessary.
    },
    setCoolState : function() {
        if (this.cool === null) {
            this.coolB.className = Controls.ENABLED + " " + Controls.DROPDOWN;
            this.coolB.innerHTML = "Find Cool";
            this.coolB.title = "Search for highly over-represented vessels";
        } else if (this.cool.length == 0) {
            this.coolB.className = Controls.DISABLED;
            this.coolB.innerHTML = "Nothing Cool";
            this.coolB.title = "No cool vessels";
        } else {
            this.coolB.className = Controls.ENABLED + " " + Controls.DROPDOWN;
            this.coolB.innerHTML = "Show Cool";
            this.coolB.title = "Show the list of highly over-represented vessels";
        }
    },
    getCachedCool : function() {
        console.log("getting cached cool");
        console.log(this.coolMethod);
        var v = this.export.getExtra(this);
        if(v !== null && v.length > this.coolMethod){
          return v[this.coolMethod];
        } else {
            return null;
        }
    },
    addCachedCool : function() {
        var v = this.export.getExtra(this);
        if (v === null) {
            v = [];
        }
        while(v.size() <= this.coolMethod) {
            v.push(null);
        }
        v[this.coolMethod] = this.cool;
        this.export.addExtra(this, v);
    },
    /**
     * @param m {number}
     */
    setCoolMethod : function(m) {
        console.log("Setting cool method");
        this.coolMethod = m;
        this.cool = null;
        this.updateCool(false);
    },
    updateCool : function(load) {
        if (this.gear !== null) {
            this.cool = this.getCachedCool();
            if (this.cool === null && load) {
                switch(this.coolMethod) {
                    case 1:
                        this.cool = this.gear.getCool(3, -1000, 1);
                        break;
                    case 2:
                        this.cool = this.gear.getCool(3, 5, 1);
                        break;
                    default:
                        this.cool = this.gear.getCool(3, 10, 0);
                }
                this.addCachedCool();
            }
        }
        while (this.coolM.hasChildNodes()) {
            this.coolM.removeChild(this.coolM.firstChild);
        }
        this.setCoolState();
        if (this.cool !== null && this.cool.length > 0) {
            for (var i = 0; i < this.cool.length; i++) {
                var node = document.createElement('li');
                var nodeText = (i+1) + ": score " + Math.round(this.cool[i].score);
                node.innerHTML = nodeText;
                node.addEventListener('click', this.coolL(nodeText).bind(this));
                this.coolM.appendChild(node);
            }
        }
    },
    setGear : function(gear) {
        this.gear = gear;
    },
    /**
     * The next two functions are keyboard shortcuts.
     * @param comp
     */
    setActions : function(comp) {
        // TODO: Implement this last.
    },
    removeBindingFully : function(comp, key) {
        // TODO: Implement this later.
    },
    updateGUI : function() {
        var iL = this.genes.getSource().getAttributes().get("itemsLabel", "items");
        this.allB.title = "Select all " + iL;
        this.noneB.title = "Unselect all " + iL;
    },
    listUpdated : function(e) {
        if (this.genes.hasPrev()) {
            this.backB.className = Controls.ENABLED;
        } else {
            this.backB.className = Controls.DISABLED;
        }
        if (this.genes.hasNext()) {
            this.forwardB.className = Controls.ENABLED;
        } else {
            this.forwardB.className = Controls.DISABLED;
        }
        switch(e.getType()) {

            case GeneEvent.NEW_LIST:
                this.updateGUI();
                console.log("Done with new list from controls");
                break;
            case GeneEvent.RESTART:
            case GeneEvent.NARROW:
                this.cool = null;
                this.updateCool(false);
                break;
            case GeneEvent.MULTI_START:
                this.unionB.className = Controls.ENABLED;
                this.intersectB.className = Controls.ENABLED;
                break;
            case GeneEvent.MULTI_FINISH:
                this.unionB.className = Controls.DISABLED;
                this.intersectB.className = Controls.DISABLED;
                break;
            default:
                break;
        }
    },
    runRestart : function() {
        this.genes.restart(this);
    },
    runAll : function() {
        this.genes.setSelection(this, this.genes.getActiveSet());
    },
    runNone : function() {
        this.genes.setSelection(this, new SortedSet());
    },
    runBack : function() {
        this.genes.back(this);
    },
    runForward : function() {
        this.genes.forward(this);
    },
    runNarrow : function() {
        this.genes.narrow(this);
    },
    runUnion : function() {
        if(this.unionB.className == Controls.ENABLED){
          this.genes.finishMultiSelect(this, MultiSelectable.UNION);
        }
    },
    runIntersect : function() {
        if(this.intersectB.className == Controls.ENABLED){
          this.genes.finishMultiSelect(this, MultiSelectable.INTERSECT);
        }
    },
    runCool : function() {
        if (this.cool === null) {
            this.updateCool(true);
            if (this.cool.length === 0) {
                const errMsg = document.createElement("li");
                errMsg.innerHTML = "No cool vessels found - try narrowing or restarting.";
                this.coolM.appendChild(errMsg);
            }
        }
        if(this.cool.length > 0){
            //show the cool options with dropdown menu
        }

    },
    coolL : function(s) {
        var idx = Number(s.substr(0, s.indexOf(':'))) - 1;
        this.genes.setSelection(this, this.cool[idx].vessel.activeGenes);
    },
    updateGenes: function(){

    }
};

module.exports = Controls;
