(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Encapsulates all events affecting the master {@link GeneList}.
 * Sungear creates one {@link GeneList} object and one {@link DataSource} object in
 * {@link app.VisGene}, and maintains them throughout the life of the application.
 * Note that this class can be extended with new event types.
 * @author crispy
 * Copyright Chris Poultney 2004.
 */

/**
 * Build a new event object describing a Sungear event.
 * @param list the list this event pertains to
 * @param source the object that generated the event
 * @param type the type of event
 */
function GeneEvent(list, source, type) {
    this.list = list;       /** The {@link GeneList} this event pertains to. */
    this.source = source;   /** The object, GUI or otherwise, that generated the event */
    this.type = type;       /** The current event, chose from the list of event types above. */
}

GeneEvent.NEW_SOURCE = 0;   /** Indicates that a new species/hierarchy and experiment have been chosen. */
GeneEvent.NEW_LIST = 1;     /** Indicates that a new experiment (list of genes) has been specified, but the species and hierarchy have not changed. */
GeneEvent.RESTART = 2;      /** Indicates that a restart with the current experiment has been requested; generally this consists of a narrow to the full experiment set and a full select. */
GeneEvent.NARROW = 3;       /** Indicates that a new working set has been chosen. */
GeneEvent.SELECT = 4;       /** Indicates that a change has been made to the current selected set. */
GeneEvent.HIGHLIGHT = 5;    /** Indicates that highlight set has been changed. */
GeneEvent.MULTI_START = 6;  /** Indicates the beginning of a multiple selection operation (Ctrl-Alt-click). */
GeneEvent.MULTI_FINISH = 7; /** Indicates the end of a multiple selection operation. */

GeneEvent.prototype = {
    constructor : GeneEvent,
    /**
     * Public get method for the event's gene list.
     * @return the gene list this event pertains to
     */
    getGeneList : function() {
        return this.list;
    },
    /**
     * Public get method for the event's source object.
     * @return the object that generated this event
     */
    getSource : function() {
        return this.source;
    },
    /**
     * Public get method for the event's type.
     * @return an integer describing the event type, chosen from the public final static ints declared above
     */
    getType : function() {
        return this.type;
    }
};

module.exports = GeneEvent;
},{}],2:[function(require,module,exports){
/**
 * Interface to be implemented by all components that can participate
 * in a multiple select operation.
 *
 * @author crispy
 */

function MultiSelectable() {
    // TODO: @Dennis find instantiation in SG
}

/** Indicates a union multi-select operation */
MultiSelectable.UNION = 0;
/** Indicates an intersect multi-select operations */
MultiSelectable.INTERSECT = 1;

MultiSelectable.prototype.getMultiSelection = function() {
    // TODO: @Dennis implement better.
    return [];
};

module.exports = MultiSelectable;
},{}],3:[function(require,module,exports){
/**
 * The Controls class contains the buttons which belong to the controlF panel.
 * They then call actions on a given GeneList
 */

var MultiSelectable = require('../genes/multiSelectable');
var GeneEvent = require('../genes/geneEvent');

/**
 * @param gn {GeneList}
 * @param el {ExportList}
 * @constructor
 */
function Controls(gn, el) {
    this.genes = gn;
    this.gear = null;
    this.export = el;   // TODO: Make sure this works.
    this.coolMethod = 0;
    this.cool = []; /** {Comp.CoolVessel[]} */

    this.restartB = document.getElementById('restartB');
    this.restartB.title = "Work with the original active set";
    this.restartB.addEventListener("click", function() {
        this.genes.restart(this);
    });
    this.allB = document.getElementById('allB');
    this.allB.title = "Select all items";
    this.allB.addEventListener("click", function() {
        this.genes.setSelection(this, this.genes.getActiveSet());
    });
    this.noneB = document.getElementById('noneB');
    this.noneB.title = "Unselect all items";
    this.noneB.addEventListener("click", function() {
        this.genes.setSelection(this, new TreeSet());
    });
    this.backB = document.getElementById('backB');
    this.backB.title = "Go back to the previous selected set";
    this.backB.addEventListener("click", function() {
        this.genes.back(this);
    });
    this.forwardB = document.getElementById('forwardB');
    this.forwardB.title = "Go forward to the next selected set";
    this.forwardB.addEventListener("click", function() {
        this.genes.forward(this);
    });
    this.narrowB = document.getElementById('narrowB');
    this.narrowB.title = "Restrict the active set to the current selected set";
    this.narrowB.addEventListener("click", function() {
        this.genes.narrow(this);
    });
    
    this.unionB = document.getElementById('unionB');
    this.unionB.title = "Set the selected set to the union of all selected items";
    this.unionB.disabled = true;    // FIXME: Make sure this is visual.
    this.unionB.addEventListener("click", function() {
        this.genes.finishMultiSelect(this, MultiSelectable.UNION);
    });
    this.intersectB = document.getElementById('intersectB');
    this.intersectB.title = "Set the selected set to the intersect of all selected items";
    this.intersectB.isDisabled = true;  // FIXME: Make sure this is visual.
    this.intersectB.addEventListener("click", function() {
        this.genes.finishMultiSelect(this, MultiSelectable.INTERSECT);
    });
    this.coolM = document.getElementById('coolM');
    this.coolB = document.getElementById('coolB');
    this.coolB.addEventListener("click", function() {
        if (this.cool === null) {
            this.updateCool(true);
            if (this.cool.length == 0) {
                alert("No cool vessels found - try narrowing or restarting.");
            }
        }
        if (this.cool.length > 0) {
            // TODO: Set coolM to visible.
        }
    });
    this.genes.addGeneListener(this);
}

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
            this.coolB.enabled = true; // FIXME
            this.coolB.innerHTML = "Find Cool";
            this.coolB.title = "Search for highly over-represented vessels";
        } else if (this.cool.length == 0) {
            this.coolB.enabled = false; // FIXME
            this.coolB.innerHTML = "Nothing Cool";
            this.coolB.title = "No cool vessels";
        } else {
            this.coolB.enabled = true; // FIXME
            this.coolB.innerHTML = "Show Cool";
            this.coolB.title = "Show the list of highly over-represented vessels";
        }
    },
    getCachedCool : function() {
        var v = this.export.get().getExtra(this); // TODO: Ensure this works.
        var cc = null;
        if (v !== null && v.length > this.coolMethod) {
            cc = v[this.coolMethod];
        }
        return cc;
    },
    /**
     * @param m {int}
     */
    setCoolMethod : function(m) {
        this.coolMethod = m;
        this.cool = null;
        this.updateCool(false);
    },
    updateCool : function(load) {
        if (this.gear !== null && this.gear.get() !== null) {
            this.cool = this.getCachedCool();
            if (this.cool === null && load) {
                switch(this.coolMethod) {
                    // TODO: @Dennis find out what is going on here.
                    case 1:
                        this.cool = this.gear.get().getCool(3, -1000, 1);
                        break;
                    case 2:
                        this.cool = this.gear.get().getCool(3, 5, 1);
                        break;
                    default:
                        this.cool = this.gear.get().getCool(3, 10, 0);
                }
                this.addCachedCool();
            }
        }
        while (this.coolM.firstChild) {
            this.coolM.removeChild(this.coolM.firstChild);
        }
        this.setCoolState();
        if (this.cool !== null && this.cool.length > 0) {
            // TODO: Figure out lines 208 - 219
        }
    },
    setGear : function(gear) {
        this.gear = gear;
    },
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
        switch(e.getType()) {
            // FIXME on this whole mofo
            case GeneEvent.NEW_LIST:
                this.updateGUI();
                break;
            case GeneEvent.RESTART:
                break;
            case GeneEvent.NARROW:
                this.cool = null;
                this.updateCool(false);
                break;
            case GeneEvent.SELECT:
                this.backB.enabled = this.genes.hasPrev();
                this.forwardB.enabled = this.genes.hasNext();
                break;
            case GeneEvent.MULTI_START:
                this.unionB.enabled = true;
                this.intersectB.enabled = true;
                break;
            case GeneEvent.MULTI_FINISH:
                this.unionB.enabled = false;
                this.intersectB.enabled = false;
                break;
        }
    }
};

module.exports = Controls;
},{"../genes/geneEvent":1,"../genes/multiSelectable":2}],4:[function(require,module,exports){
/**
 * Created by dennismcdaid on 7/10/16.
 */
/**
 * BEFORE RUNNING:
 * Navigate to the overarching Sungear folder, then run:
 * browserify public/javascripts/main.js -o public/javascripts/out.js -d
 */

var Controls = require('./gui/controls');

var x = new Controls('potato', 'tomato');

// var aPls = document.getElementsByTagName("a")[0];
//
// aPls.addEventListener("click", function() {
//     alert("OH NO! IT WORKED!");
// });

},{"./gui/controls":3}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInB1YmxpYy9qYXZhc2NyaXB0cy9nZW5lcy9nZW5lRXZlbnQuanMiLCJwdWJsaWMvamF2YXNjcmlwdHMvZ2VuZXMvbXVsdGlTZWxlY3RhYmxlLmpzIiwicHVibGljL2phdmFzY3JpcHRzL2d1aS9jb250cm9scy5qcyIsInB1YmxpYy9qYXZhc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogRW5jYXBzdWxhdGVzIGFsbCBldmVudHMgYWZmZWN0aW5nIHRoZSBtYXN0ZXIge0BsaW5rIEdlbmVMaXN0fS5cbiAqIFN1bmdlYXIgY3JlYXRlcyBvbmUge0BsaW5rIEdlbmVMaXN0fSBvYmplY3QgYW5kIG9uZSB7QGxpbmsgRGF0YVNvdXJjZX0gb2JqZWN0IGluXG4gKiB7QGxpbmsgYXBwLlZpc0dlbmV9LCBhbmQgbWFpbnRhaW5zIHRoZW0gdGhyb3VnaG91dCB0aGUgbGlmZSBvZiB0aGUgYXBwbGljYXRpb24uXG4gKiBOb3RlIHRoYXQgdGhpcyBjbGFzcyBjYW4gYmUgZXh0ZW5kZWQgd2l0aCBuZXcgZXZlbnQgdHlwZXMuXG4gKiBAYXV0aG9yIGNyaXNweVxuICogQ29weXJpZ2h0IENocmlzIFBvdWx0bmV5IDIwMDQuXG4gKi9cblxuLyoqXG4gKiBCdWlsZCBhIG5ldyBldmVudCBvYmplY3QgZGVzY3JpYmluZyBhIFN1bmdlYXIgZXZlbnQuXG4gKiBAcGFyYW0gbGlzdCB0aGUgbGlzdCB0aGlzIGV2ZW50IHBlcnRhaW5zIHRvXG4gKiBAcGFyYW0gc291cmNlIHRoZSBvYmplY3QgdGhhdCBnZW5lcmF0ZWQgdGhlIGV2ZW50XG4gKiBAcGFyYW0gdHlwZSB0aGUgdHlwZSBvZiBldmVudFxuICovXG5mdW5jdGlvbiBHZW5lRXZlbnQobGlzdCwgc291cmNlLCB0eXBlKSB7XG4gICAgdGhpcy5saXN0ID0gbGlzdDsgICAgICAgLyoqIFRoZSB7QGxpbmsgR2VuZUxpc3R9IHRoaXMgZXZlbnQgcGVydGFpbnMgdG8uICovXG4gICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7ICAgLyoqIFRoZSBvYmplY3QsIEdVSSBvciBvdGhlcndpc2UsIHRoYXQgZ2VuZXJhdGVkIHRoZSBldmVudCAqL1xuICAgIHRoaXMudHlwZSA9IHR5cGU7ICAgICAgIC8qKiBUaGUgY3VycmVudCBldmVudCwgY2hvc2UgZnJvbSB0aGUgbGlzdCBvZiBldmVudCB0eXBlcyBhYm92ZS4gKi9cbn1cblxuR2VuZUV2ZW50Lk5FV19TT1VSQ0UgPSAwOyAgIC8qKiBJbmRpY2F0ZXMgdGhhdCBhIG5ldyBzcGVjaWVzL2hpZXJhcmNoeSBhbmQgZXhwZXJpbWVudCBoYXZlIGJlZW4gY2hvc2VuLiAqL1xuR2VuZUV2ZW50Lk5FV19MSVNUID0gMTsgICAgIC8qKiBJbmRpY2F0ZXMgdGhhdCBhIG5ldyBleHBlcmltZW50IChsaXN0IG9mIGdlbmVzKSBoYXMgYmVlbiBzcGVjaWZpZWQsIGJ1dCB0aGUgc3BlY2llcyBhbmQgaGllcmFyY2h5IGhhdmUgbm90IGNoYW5nZWQuICovXG5HZW5lRXZlbnQuUkVTVEFSVCA9IDI7ICAgICAgLyoqIEluZGljYXRlcyB0aGF0IGEgcmVzdGFydCB3aXRoIHRoZSBjdXJyZW50IGV4cGVyaW1lbnQgaGFzIGJlZW4gcmVxdWVzdGVkOyBnZW5lcmFsbHkgdGhpcyBjb25zaXN0cyBvZiBhIG5hcnJvdyB0byB0aGUgZnVsbCBleHBlcmltZW50IHNldCBhbmQgYSBmdWxsIHNlbGVjdC4gKi9cbkdlbmVFdmVudC5OQVJST1cgPSAzOyAgICAgICAvKiogSW5kaWNhdGVzIHRoYXQgYSBuZXcgd29ya2luZyBzZXQgaGFzIGJlZW4gY2hvc2VuLiAqL1xuR2VuZUV2ZW50LlNFTEVDVCA9IDQ7ICAgICAgIC8qKiBJbmRpY2F0ZXMgdGhhdCBhIGNoYW5nZSBoYXMgYmVlbiBtYWRlIHRvIHRoZSBjdXJyZW50IHNlbGVjdGVkIHNldC4gKi9cbkdlbmVFdmVudC5ISUdITElHSFQgPSA1OyAgICAvKiogSW5kaWNhdGVzIHRoYXQgaGlnaGxpZ2h0IHNldCBoYXMgYmVlbiBjaGFuZ2VkLiAqL1xuR2VuZUV2ZW50Lk1VTFRJX1NUQVJUID0gNjsgIC8qKiBJbmRpY2F0ZXMgdGhlIGJlZ2lubmluZyBvZiBhIG11bHRpcGxlIHNlbGVjdGlvbiBvcGVyYXRpb24gKEN0cmwtQWx0LWNsaWNrKS4gKi9cbkdlbmVFdmVudC5NVUxUSV9GSU5JU0ggPSA3OyAvKiogSW5kaWNhdGVzIHRoZSBlbmQgb2YgYSBtdWx0aXBsZSBzZWxlY3Rpb24gb3BlcmF0aW9uLiAqL1xuXG5HZW5lRXZlbnQucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yIDogR2VuZUV2ZW50LFxuICAgIC8qKlxuICAgICAqIFB1YmxpYyBnZXQgbWV0aG9kIGZvciB0aGUgZXZlbnQncyBnZW5lIGxpc3QuXG4gICAgICogQHJldHVybiB0aGUgZ2VuZSBsaXN0IHRoaXMgZXZlbnQgcGVydGFpbnMgdG9cbiAgICAgKi9cbiAgICBnZXRHZW5lTGlzdCA6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5saXN0O1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogUHVibGljIGdldCBtZXRob2QgZm9yIHRoZSBldmVudCdzIHNvdXJjZSBvYmplY3QuXG4gICAgICogQHJldHVybiB0aGUgb2JqZWN0IHRoYXQgZ2VuZXJhdGVkIHRoaXMgZXZlbnRcbiAgICAgKi9cbiAgICBnZXRTb3VyY2UgOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogUHVibGljIGdldCBtZXRob2QgZm9yIHRoZSBldmVudCdzIHR5cGUuXG4gICAgICogQHJldHVybiBhbiBpbnRlZ2VyIGRlc2NyaWJpbmcgdGhlIGV2ZW50IHR5cGUsIGNob3NlbiBmcm9tIHRoZSBwdWJsaWMgZmluYWwgc3RhdGljIGludHMgZGVjbGFyZWQgYWJvdmVcbiAgICAgKi9cbiAgICBnZXRUeXBlIDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnR5cGU7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBHZW5lRXZlbnQ7IiwiLyoqXHJcbiAqIEludGVyZmFjZSB0byBiZSBpbXBsZW1lbnRlZCBieSBhbGwgY29tcG9uZW50cyB0aGF0IGNhbiBwYXJ0aWNpcGF0ZVxyXG4gKiBpbiBhIG11bHRpcGxlIHNlbGVjdCBvcGVyYXRpb24uXHJcbiAqXHJcbiAqIEBhdXRob3IgY3Jpc3B5XHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gTXVsdGlTZWxlY3RhYmxlKCkge1xyXG4gICAgLy8gVE9ETzogQERlbm5pcyBmaW5kIGluc3RhbnRpYXRpb24gaW4gU0dcclxufVxyXG5cclxuLyoqIEluZGljYXRlcyBhIHVuaW9uIG11bHRpLXNlbGVjdCBvcGVyYXRpb24gKi9cclxuTXVsdGlTZWxlY3RhYmxlLlVOSU9OID0gMDtcclxuLyoqIEluZGljYXRlcyBhbiBpbnRlcnNlY3QgbXVsdGktc2VsZWN0IG9wZXJhdGlvbnMgKi9cclxuTXVsdGlTZWxlY3RhYmxlLklOVEVSU0VDVCA9IDE7XHJcblxyXG5NdWx0aVNlbGVjdGFibGUucHJvdG90eXBlLmdldE11bHRpU2VsZWN0aW9uID0gZnVuY3Rpb24oKSB7XHJcbiAgICAvLyBUT0RPOiBARGVubmlzIGltcGxlbWVudCBiZXR0ZXIuXHJcbiAgICByZXR1cm4gW107XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE11bHRpU2VsZWN0YWJsZTsiLCIvKipcbiAqIFRoZSBDb250cm9scyBjbGFzcyBjb250YWlucyB0aGUgYnV0dG9ucyB3aGljaCBiZWxvbmcgdG8gdGhlIGNvbnRyb2xGIHBhbmVsLlxuICogVGhleSB0aGVuIGNhbGwgYWN0aW9ucyBvbiBhIGdpdmVuIEdlbmVMaXN0XG4gKi9cblxudmFyIE11bHRpU2VsZWN0YWJsZSA9IHJlcXVpcmUoJy4uL2dlbmVzL211bHRpU2VsZWN0YWJsZScpO1xudmFyIEdlbmVFdmVudCA9IHJlcXVpcmUoJy4uL2dlbmVzL2dlbmVFdmVudCcpO1xuXG4vKipcbiAqIEBwYXJhbSBnbiB7R2VuZUxpc3R9XG4gKiBAcGFyYW0gZWwge0V4cG9ydExpc3R9XG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gQ29udHJvbHMoZ24sIGVsKSB7XG4gICAgdGhpcy5nZW5lcyA9IGduO1xuICAgIHRoaXMuZ2VhciA9IG51bGw7XG4gICAgdGhpcy5leHBvcnQgPSBlbDsgICAvLyBUT0RPOiBNYWtlIHN1cmUgdGhpcyB3b3Jrcy5cbiAgICB0aGlzLmNvb2xNZXRob2QgPSAwO1xuICAgIHRoaXMuY29vbCA9IFtdOyAvKioge0NvbXAuQ29vbFZlc3NlbFtdfSAqL1xuXG4gICAgdGhpcy5yZXN0YXJ0QiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXJ0QicpO1xuICAgIHRoaXMucmVzdGFydEIudGl0bGUgPSBcIldvcmsgd2l0aCB0aGUgb3JpZ2luYWwgYWN0aXZlIHNldFwiO1xuICAgIHRoaXMucmVzdGFydEIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmdlbmVzLnJlc3RhcnQodGhpcyk7XG4gICAgfSk7XG4gICAgdGhpcy5hbGxCID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FsbEInKTtcbiAgICB0aGlzLmFsbEIudGl0bGUgPSBcIlNlbGVjdCBhbGwgaXRlbXNcIjtcbiAgICB0aGlzLmFsbEIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmdlbmVzLnNldFNlbGVjdGlvbih0aGlzLCB0aGlzLmdlbmVzLmdldEFjdGl2ZVNldCgpKTtcbiAgICB9KTtcbiAgICB0aGlzLm5vbmVCID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25vbmVCJyk7XG4gICAgdGhpcy5ub25lQi50aXRsZSA9IFwiVW5zZWxlY3QgYWxsIGl0ZW1zXCI7XG4gICAgdGhpcy5ub25lQi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZ2VuZXMuc2V0U2VsZWN0aW9uKHRoaXMsIG5ldyBUcmVlU2V0KCkpO1xuICAgIH0pO1xuICAgIHRoaXMuYmFja0IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFja0InKTtcbiAgICB0aGlzLmJhY2tCLnRpdGxlID0gXCJHbyBiYWNrIHRvIHRoZSBwcmV2aW91cyBzZWxlY3RlZCBzZXRcIjtcbiAgICB0aGlzLmJhY2tCLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5nZW5lcy5iYWNrKHRoaXMpO1xuICAgIH0pO1xuICAgIHRoaXMuZm9yd2FyZEIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZm9yd2FyZEInKTtcbiAgICB0aGlzLmZvcndhcmRCLnRpdGxlID0gXCJHbyBmb3J3YXJkIHRvIHRoZSBuZXh0IHNlbGVjdGVkIHNldFwiO1xuICAgIHRoaXMuZm9yd2FyZEIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmdlbmVzLmZvcndhcmQodGhpcyk7XG4gICAgfSk7XG4gICAgdGhpcy5uYXJyb3dCID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25hcnJvd0InKTtcbiAgICB0aGlzLm5hcnJvd0IudGl0bGUgPSBcIlJlc3RyaWN0IHRoZSBhY3RpdmUgc2V0IHRvIHRoZSBjdXJyZW50IHNlbGVjdGVkIHNldFwiO1xuICAgIHRoaXMubmFycm93Qi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZ2VuZXMubmFycm93KHRoaXMpO1xuICAgIH0pO1xuICAgIFxuICAgIHRoaXMudW5pb25CID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VuaW9uQicpO1xuICAgIHRoaXMudW5pb25CLnRpdGxlID0gXCJTZXQgdGhlIHNlbGVjdGVkIHNldCB0byB0aGUgdW5pb24gb2YgYWxsIHNlbGVjdGVkIGl0ZW1zXCI7XG4gICAgdGhpcy51bmlvbkIuZGlzYWJsZWQgPSB0cnVlOyAgICAvLyBGSVhNRTogTWFrZSBzdXJlIHRoaXMgaXMgdmlzdWFsLlxuICAgIHRoaXMudW5pb25CLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5nZW5lcy5maW5pc2hNdWx0aVNlbGVjdCh0aGlzLCBNdWx0aVNlbGVjdGFibGUuVU5JT04pO1xuICAgIH0pO1xuICAgIHRoaXMuaW50ZXJzZWN0QiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnRlcnNlY3RCJyk7XG4gICAgdGhpcy5pbnRlcnNlY3RCLnRpdGxlID0gXCJTZXQgdGhlIHNlbGVjdGVkIHNldCB0byB0aGUgaW50ZXJzZWN0IG9mIGFsbCBzZWxlY3RlZCBpdGVtc1wiO1xuICAgIHRoaXMuaW50ZXJzZWN0Qi5pc0Rpc2FibGVkID0gdHJ1ZTsgIC8vIEZJWE1FOiBNYWtlIHN1cmUgdGhpcyBpcyB2aXN1YWwuXG4gICAgdGhpcy5pbnRlcnNlY3RCLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5nZW5lcy5maW5pc2hNdWx0aVNlbGVjdCh0aGlzLCBNdWx0aVNlbGVjdGFibGUuSU5URVJTRUNUKTtcbiAgICB9KTtcbiAgICB0aGlzLmNvb2xNID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nvb2xNJyk7XG4gICAgdGhpcy5jb29sQiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb29sQicpO1xuICAgIHRoaXMuY29vbEIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5jb29sID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUNvb2wodHJ1ZSk7XG4gICAgICAgICAgICBpZiAodGhpcy5jb29sLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJObyBjb29sIHZlc3NlbHMgZm91bmQgLSB0cnkgbmFycm93aW5nIG9yIHJlc3RhcnRpbmcuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNvb2wubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgLy8gVE9ETzogU2V0IGNvb2xNIHRvIHZpc2libGUuXG4gICAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmdlbmVzLmFkZEdlbmVMaXN0ZW5lcih0aGlzKTtcbn1cblxuQ29udHJvbHMucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yIDogQ29udHJvbHMsXG4gICAgY2xlYW51cCA6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmdlbmVzID0gbnVsbDtcbiAgICAgICAgdGhpcy5jb29sID0gbnVsbDtcbiAgICB9LFxuICAgIGdldFByZWZlcnJlZFNpemUgOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gVE9ETzogSW1wbGVtZW50PyBNYXkgYmUgdW5uZWNlc3NhcnkuXG4gICAgfSxcbiAgICBzZXRDb29sU3RhdGUgOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuY29vbCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5jb29sQi5lbmFibGVkID0gdHJ1ZTsgLy8gRklYTUVcbiAgICAgICAgICAgIHRoaXMuY29vbEIuaW5uZXJIVE1MID0gXCJGaW5kIENvb2xcIjtcbiAgICAgICAgICAgIHRoaXMuY29vbEIudGl0bGUgPSBcIlNlYXJjaCBmb3IgaGlnaGx5IG92ZXItcmVwcmVzZW50ZWQgdmVzc2Vsc1wiO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY29vbC5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgdGhpcy5jb29sQi5lbmFibGVkID0gZmFsc2U7IC8vIEZJWE1FXG4gICAgICAgICAgICB0aGlzLmNvb2xCLmlubmVySFRNTCA9IFwiTm90aGluZyBDb29sXCI7XG4gICAgICAgICAgICB0aGlzLmNvb2xCLnRpdGxlID0gXCJObyBjb29sIHZlc3NlbHNcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY29vbEIuZW5hYmxlZCA9IHRydWU7IC8vIEZJWE1FXG4gICAgICAgICAgICB0aGlzLmNvb2xCLmlubmVySFRNTCA9IFwiU2hvdyBDb29sXCI7XG4gICAgICAgICAgICB0aGlzLmNvb2xCLnRpdGxlID0gXCJTaG93IHRoZSBsaXN0IG9mIGhpZ2hseSBvdmVyLXJlcHJlc2VudGVkIHZlc3NlbHNcIjtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZ2V0Q2FjaGVkQ29vbCA6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdiA9IHRoaXMuZXhwb3J0LmdldCgpLmdldEV4dHJhKHRoaXMpOyAvLyBUT0RPOiBFbnN1cmUgdGhpcyB3b3Jrcy5cbiAgICAgICAgdmFyIGNjID0gbnVsbDtcbiAgICAgICAgaWYgKHYgIT09IG51bGwgJiYgdi5sZW5ndGggPiB0aGlzLmNvb2xNZXRob2QpIHtcbiAgICAgICAgICAgIGNjID0gdlt0aGlzLmNvb2xNZXRob2RdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjYztcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBtIHtpbnR9XG4gICAgICovXG4gICAgc2V0Q29vbE1ldGhvZCA6IGZ1bmN0aW9uKG0pIHtcbiAgICAgICAgdGhpcy5jb29sTWV0aG9kID0gbTtcbiAgICAgICAgdGhpcy5jb29sID0gbnVsbDtcbiAgICAgICAgdGhpcy51cGRhdGVDb29sKGZhbHNlKTtcbiAgICB9LFxuICAgIHVwZGF0ZUNvb2wgOiBmdW5jdGlvbihsb2FkKSB7XG4gICAgICAgIGlmICh0aGlzLmdlYXIgIT09IG51bGwgJiYgdGhpcy5nZWFyLmdldCgpICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmNvb2wgPSB0aGlzLmdldENhY2hlZENvb2woKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvb2wgPT09IG51bGwgJiYgbG9hZCkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCh0aGlzLmNvb2xNZXRob2QpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVE9ETzogQERlbm5pcyBmaW5kIG91dCB3aGF0IGlzIGdvaW5nIG9uIGhlcmUuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29vbCA9IHRoaXMuZ2Vhci5nZXQoKS5nZXRDb29sKDMsIC0xMDAwLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvb2wgPSB0aGlzLmdlYXIuZ2V0KCkuZ2V0Q29vbCgzLCA1LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb29sID0gdGhpcy5nZWFyLmdldCgpLmdldENvb2woMywgMTAsIDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmFkZENhY2hlZENvb2woKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAodGhpcy5jb29sTS5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICB0aGlzLmNvb2xNLnJlbW92ZUNoaWxkKHRoaXMuY29vbE0uZmlyc3RDaGlsZCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRDb29sU3RhdGUoKTtcbiAgICAgICAgaWYgKHRoaXMuY29vbCAhPT0gbnVsbCAmJiB0aGlzLmNvb2wubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgLy8gVE9ETzogRmlndXJlIG91dCBsaW5lcyAyMDggLSAyMTlcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2V0R2VhciA6IGZ1bmN0aW9uKGdlYXIpIHtcbiAgICAgICAgdGhpcy5nZWFyID0gZ2VhcjtcbiAgICB9LFxuICAgIHNldEFjdGlvbnMgOiBmdW5jdGlvbihjb21wKSB7XG4gICAgICAgIC8vIFRPRE86IEltcGxlbWVudCB0aGlzIGxhc3QuXG4gICAgfSxcbiAgICByZW1vdmVCaW5kaW5nRnVsbHkgOiBmdW5jdGlvbihjb21wLCBrZXkpIHtcbiAgICAgICAgLy8gVE9ETzogSW1wbGVtZW50IHRoaXMgbGF0ZXIuXG4gICAgfSxcbiAgICB1cGRhdGVHVUkgOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGlMID0gdGhpcy5nZW5lcy5nZXRTb3VyY2UoKS5nZXRBdHRyaWJ1dGVzKCkuZ2V0KFwiaXRlbXNMYWJlbFwiLCBcIml0ZW1zXCIpO1xuICAgICAgICB0aGlzLmFsbEIudGl0bGUgPSBcIlNlbGVjdCBhbGwgXCIgKyBpTDtcbiAgICAgICAgdGhpcy5ub25lQi50aXRsZSA9IFwiVW5zZWxlY3QgYWxsIFwiICsgaUw7XG4gICAgfSxcbiAgICBsaXN0VXBkYXRlZCA6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgc3dpdGNoKGUuZ2V0VHlwZSgpKSB7XG4gICAgICAgICAgICAvLyBGSVhNRSBvbiB0aGlzIHdob2xlIG1vZm9cbiAgICAgICAgICAgIGNhc2UgR2VuZUV2ZW50Lk5FV19MSVNUOlxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlR1VJKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEdlbmVFdmVudC5SRVNUQVJUOlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBHZW5lRXZlbnQuTkFSUk9XOlxuICAgICAgICAgICAgICAgIHRoaXMuY29vbCA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVDb29sKGZhbHNlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgR2VuZUV2ZW50LlNFTEVDVDpcbiAgICAgICAgICAgICAgICB0aGlzLmJhY2tCLmVuYWJsZWQgPSB0aGlzLmdlbmVzLmhhc1ByZXYoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmZvcndhcmRCLmVuYWJsZWQgPSB0aGlzLmdlbmVzLmhhc05leHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgR2VuZUV2ZW50Lk1VTFRJX1NUQVJUOlxuICAgICAgICAgICAgICAgIHRoaXMudW5pb25CLmVuYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJzZWN0Qi5lbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgR2VuZUV2ZW50Lk1VTFRJX0ZJTklTSDpcbiAgICAgICAgICAgICAgICB0aGlzLnVuaW9uQi5lbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnRlcnNlY3RCLmVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udHJvbHM7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGRlbm5pc21jZGFpZCBvbiA3LzEwLzE2LlxuICovXG4vKipcbiAqIEJFRk9SRSBSVU5OSU5HOlxuICogTmF2aWdhdGUgdG8gdGhlIG92ZXJhcmNoaW5nIFN1bmdlYXIgZm9sZGVyLCB0aGVuIHJ1bjpcbiAqIGJyb3dzZXJpZnkgcHVibGljL2phdmFzY3JpcHRzL21haW4uanMgLW8gcHVibGljL2phdmFzY3JpcHRzL291dC5qcyAtZFxuICovXG5cbnZhciBDb250cm9scyA9IHJlcXVpcmUoJy4vZ3VpL2NvbnRyb2xzJyk7XG5cbnZhciB4ID0gbmV3IENvbnRyb2xzKCdwb3RhdG8nLCAndG9tYXRvJyk7XG5cbi8vIHZhciBhUGxzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJhXCIpWzBdO1xuLy9cbi8vIGFQbHMuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuLy8gICAgIGFsZXJ0KFwiT0ggTk8hIElUIFdPUktFRCFcIik7XG4vLyB9KTtcbiJdfQ==
