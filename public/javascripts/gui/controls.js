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