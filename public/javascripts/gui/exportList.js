"use strict";
const SortedSet = require('collections/sorted-set');
const request = require('request');
const GeneEvent = require('../genes/geneEvent');
const Map = require("collections/map");

/**
 * This entire class should offer to write up a gene set to the database.
 * @param g
 * @param context
 * @constructor
 */

function ExportList(g, context) {
    this.genes = g; /** {GeneList} */
    this.context = context; /** {AppletContext} */
    this.localUpdate = false;
    this.groupCnt = 0;
    this.table = document.getElementById('controlFtable');
    this.model = new ExportModel();

    this.removeB = document.getElementById('removeB');
    this.removeB.title = "Remove the selected sets of items";

    this.exportB = document.getElementById('exportB');
    this.exportB.title = "Send the selected sets of items to an external program";

    this.removeB.addEventListener("click", () => this.model.deleteSelected(), false);
    this.exportB.addEventListener("click", () => {
        console.log("List size: " + this.model.getList().length);
        this.model.getList().forEach((entry) => {
            console.log(entry.name + " (" + entry.genes.length + ")");
        });
        this.exportGeneList();
    });
    document.getElementById('controlFtableHeader').addEventListener("click", function() {
        // Lines 115 - 119 allow the header rows to be manipulated
    });
    document.getElementById('controlFtableAdd').addEventListener("click", () => this.selectAll(), false);
    g.addGeneListener(this);
}

ExportList.prototype = {
    constructor : ExportList,
    cleanup : function() {
        this.model.cleanup();
        this.model = null;
        this.table = null;
        this.genes = null;
    },
    /**
     * Convenience method that creates a POST method form submit
     * and reads the response.
     * @param cgi the URL to which the form should be submitted
     * @param data the form data
     * @return the text response
     * @throws IOException
     */
    post : function(cgi, data) {
        JSON.stringify(data);
        var options = {
          uri : cgi,
          method : 'POST',
          headers:{
            'content-type' : 'application/json',
          },
          body : data
        };
        request.post(options, function(err, response, body){
          if(err){
            alert('Export Error. Please open your browser console to inspect error. ');
            console.log(err);
          }else{
            return response.toString();
          }
        });

    },
    /**
     * TODO: @Dennis figure this out to be less stupid.
     * @param node
     * @param row
     * @param col
     */
    mouseListener : function(node, row, col) {
        if (row != -1) {
            var l = this.model.getList()[row];
            let s = new SortedSet(this.genes.getSelectedSet().toArray());
            this.localUpdate = true;
            switch (col) {
                case 3:
                    s = s.union(l.genes);
                    this.genes.setSelection(this, s);
                    break;
                case 4:
                    s = new SortedSet(l.genes);
                    this.genes.setSelection(this, s);
                    break;
                case 5:
                    for (let i = 0; i < l.genes.length; i++) {
                        s.remove(l.genes[i]);
                    }
                    this.genes.setSelection(this, s);
                    break;
                case 6:
                    this.model.setCurrent(l);
                    this.genes.setActive(this, l.genes);
                    // TODO: Possibly call a table.repaint?
                    break;
            }
            this.localUpdate = false;
        }
    },
    exportCellStorm : function() {
        try {
            let gl = "";
            const selectedGenes = this.genes.getSelectedSet().toArray();
            selectedGenes.forEach((gene) => {
                if (gl != "") {
                    gl += "|";
                }
                gl += gene.getName();
            });
            // TODO: Get runtime?
        } catch (e) {
            console.log("ERROR (from exportList.exportCellStorm:");
            console.log(e);
        }
    },
    exportGeneList : function() {
        try {
            const data = this.getExportsGeneList();
            console.log(data);
            const exportU = this.genes.getSource().getAttributes().get("export_url");
            const res = this.post(exportU, data);
            console.log("response: ");
            console.log(res);
            const h = new Map(); /** String => String */
            const p = res.split('&');
            p.forEach((token) => {
                const nvp = token.split("=");
                h.set(nvp[0], nvp[1]);
            });
            console.log("export response pairs:");
            console.log(h);
            if (this.context !== null) {
                try {
                    let url = h.get("url");
                    console.log("url: " + url);
                    if (typeof url !== 'undefined') {
                        let u = new URL(url); // TODO: Ensure this works.
                        const target = h.get("target");
                        console.log("u: " + u + ", target : |" +  (typeof target !== 'undefined' ? target : null) + "|");
                        if (typeof target !== 'undefined') {
                            u = new URL(target, u); // Might need to be url instead of u
                        }
                        const win = window.open(u);
                        if (win) {
                            win.focus();
                        } else {
                            alert('Please enable popups on this site to export gene lists');
                        }
                        alert('Export Complete'); // Maybe refactor?
                    } else {
                        alert('Export Warning: no response page given');
                    }
                } catch (re) {
                    alert('Export Warning: could not show response page');
                }
            }
        } catch (e) {
            console.log(e);
        }
    },
    /**
     * Formats the exports list as a pair of StringBuffer that contain
     * gene and group information, respectively.  The first StringBuffer
     * is a list of genes, one gene per line.  The second contains
     * gene/group associations in Cytoscape .noa file format.
     * @return {Array} the two StringBuffers as a Vector
     */
    getExportsCytoscape : function () {
        const ent = this.model.getList(); // Maybe??
        const v = [];
        let sif = "";   // list of all genes
        let s = new SortedSet();
        ent.forEach((entry) => {
            //noinspection JSUnresolvedFunction
            s = s.union(entry.genes);
        });
        let noa = "";   // gene group membership
        noa += "Group\n";
        //noinspection JSUnresolvedFunction
        const sArray = s.toArray();
        sArray.forEach((g) => {
            sif += g + "\n";
            let gTag = "";
            ent.forEach((entry) => {
                if (entry.genes.contains(g)) {
                    if (gTag != "") {
                        gTag += "+";
                    }
                    gTag += entry.name;
                }
            });
            noa += g + " = " + gTag + "\n";
        });
        v.push(sif);
        v.push(noa);
        return v;
    },
    /**
     * Formats the exports list as form data for the gene list export.
     * Form data is name/value pairs.  For each NVP, the name is the group
     * name, and the value is a &quot;|&quot;-delimited list of genes in
     * the group.
     * @return {String} the gene list form data
     */
    getExportsGeneList : function() {
        console.log("getting export data/export_url");
        const nvp = [];
        const attrib = this.genes.getSource().getAttributes();
        const exportRegex = new RegExp("export_", "i");
        const keys = attrib.attrib.keys();
        let next = keys.next();
        while(!next.done) {
            const k = next.value;
            if (exportRegex.test(k) && k != "export_url") {
                this.addPair(nvp, k.substr(7), attrib.get(k));
            }
        }
        // gather group/gene information
        const modelList = this.model.getList();
        const groups = [];
        const genes = [];
        modelList.forEach((e) => {
            if (e.selected) {
                groups.push(e.name);
                genes.push(e.name + "=" + this.separate(e.genes, "|", true));
            }
        });
        this.addPair(nvp, "groups", this.separate(groups, "|", false));
        genes.forEach((gene) => {
            nvp.push(gene);
        });
        const exp = this.separate(nvp, "&", false);
        console.log(exp);
        return exp;
    },
    /**
     * Updates the column names and tool tips based on the current data items type.
     * Deals with the stupid column-sizing issue on column name change.
     */
    updateGUI : function() {
        const iL = this.genes.getSource().getAttributes().get("itemsLabel", "items");
        this.removeB.title = "Remove the selected sets of " + iL;
        this.exportB.title = "Send the selected sets of " + iL + " to an external program";
        // TODO: Finish
    },
    setColumnToolTip : function(col, text) {
        // TODO: Implement
    },
    /**
     * @param nvp {Array} of Strings
     * @param name {string}
     * @param value {string}
     */
    addPair : function(nvp, name, value) {
        nvp.push( "{" + name + ":" + value + "}" );
    },
    /**
     * @param c {Object}
     * @param sep {string}
     * @param escape {bool}
     * @returns {string}
     */
    separate : function(c, sep, escape) {
        let f = true;
        if (!Array.isArray(c)) {
            c = c.toArray();
        }
        let s = "";
        c.forEach((item) => {
            if (!f) s += sep;
            f = false;
            s += item;
        });
        return escape ? new URL(s) : s; // TODO: Ensure this is correct.
    },
    /**
     * @param e {GeneEvent}
     */
    listUpdated : function(e) {
        switch (e.getType) {
            case GeneEvent.NEW_LIST:
                this.model.clear();
                this.model.setCurrent(this.addGroup());
                const hasExport = this.genes.getSource().getAttributes().get("export_url");
                this.exportB.className = (typeof hasExport !== 'undefined' ? ExportList.ENABLED : ExportList.DISABLED);
                this.updateGUI();
                break;
            case GeneEvent.RESTART:
                this.model.resetCurrent();
                this.model.setCurrent(this.addGroup());
                break;
            case GeneEvent.NARROW:
                if (!this.localUpdate) this.addGroup();
                break;
            default:
                break;
        }
    },
    selectAll : function() {
        const list = this.model.getList();
        let all = true;
        list.forEach((entry) => {
            all = entry.selected && all;
        });
        list.forEach((entry) => {
            entry.selected = !all;
        });
        this.model.fireTableDataChanged();
    },
    /**
     * Adds a new group, with a default name, to the export list.
     */
    addGroup : function() {
        const s = new SortedSet(this.genes.getActiveSet());
        return this.model.addGroup("group"+this.groupCnt++, s);
    },
    addExtra : function(key, value) {
        this.model.curr.extra.set(key, value);
    },
    getExtra : function(key) {
        const value = this.model.curr.extra.get(key);
        return typeof value !== 'undefined' ? value : null;
    }
};

ExportList.ENABLED = "btn btn-primary";
ExportList.DISABLED = "btn btn-primary disabled";

function getPasswordAuthentication() {
    // TODO: Implement
}

function GoIcon() {
    this.p = {
        x : [ 0, 0, GoIcon.W-1 ],
        y : [ 0, GoIcon.H-1, GoIcon.H/2 ]
    }
}

GoIcon.W = 10;
GoIcon.H = 9;

GoIcon.prototype = {
    constructor : GoIcon,
    getIconWidth : function() {
        return GoIcon.W;
    },
    getIconHeight : function() {
        return GoIcon.H;
    },
    paintIcon : function(c, p5, x, y) {
        p5.push();
        p5.setStroke("#000000");
        p5.translate(x, y);
        p5.triangle(this.p.x[0], this.p.y[0],
        this.p.x[1], this.p.y[1], this.p.x[2], this.p.y[2]);
        p5.pop();
    }
};

/**
 * @param name {String}
 * @param genes {SortedSet} of Genes
 * @param parent {ListEntry}
 * @constructor
 */
function ListEntry(name, genes, parent) {
    this.name = name;
    this.genes = genes;
    this.parent = parent;
    this.selected = false;
    this.children = [];     /** {Array} of ListEntry objects */
    if (this.parent !== null) {
        parent.addChild(this);
    }
    this.indent = (this.parent === null ? 0 : this.parent.indent+1);    /** {Number} */
    this.extra = new Map();        /** {Hashtable<Object, Object>} */
}

ListEntry.prototype = {
    constructor : ListEntry,
    addChild : function(c) {
        this.children.push(c);
    },
    removeChild : function(c) {
        const index = this.children.indexOf(c);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }
};

function ExportModel() {
    this.titles = [ "+/-", "Name", "", "", "", "", "" ];
    this.setType("items");
    this.goI = document.createElement('span');
    this.goI.className = "glyphicon glyphicon-play";
    this.unI = document.createElement('span');
    this.unI.className = "glyphicon glyphicon-plus-sign";
    this.intI = document.createElement('span');
    this.intI.className = "glyphicon glyphicon-adjust";
    this.subI = document.createElement('span');
    this.subI.className = "glyphicon glyphicon-minus-sign";
    this.exportList = [];
    this.root = new ListEntry("root", new SortedSet(), null);
    this.curr = this.root;
}

ExportModel.prototype = {
    constructor : ExportModel,
    cleanup : function() {
        this.exportList = null;
    },
    setType : function(s) {
        this.titles[2] = "# " + s;
    },
    getColumnCount : function() {
        return this.titles.length;
    },
    getRowCount : function() {
        return this.exportList.length;
    },
    getColumnName : function(col) {
        return this.titles[col];
    },
    isCellEditable : function(row, col) {
        return col == 0 || col == 1;
    },
    getColumnClass : function(c) {
        if (c > 2) {
            // TODO: @Dennis Implement
            console.log("No idea what this function does, but c is greater than 2");
        } else {
            console.log("No idea what this function does, but c is less than 2");
        }
    },
    getValueAt : function(row, col) {
        switch(col) {
            case 0:
                return this.exportList[row].selected;
            case 1:
                return this.exportList[row].name;
            case 2:
                return this.exportList[row].genes.size()+"";
            case 3:
                return this.unI;
            case 4:
                return this.intI;
            case 5:
                return this.subI;
            case 6:
                return this.goI;
            default:
                return "";
        }
    },
    setValueAt : function(aValue, row, col) {
        switch(col) {
            case 0:
                this.exportList[row].selected = !this.exportList[row].selected;
                break;
            case 1:
                this.exportList[row].name = aValue;
                break;
        }
    },
    buildListRec : function(r) {
        if (r != this.root) {
            this.exportList.push(r);
        }
        r.children.forEach((child) => {
            this.buildListRec(child);
        });
    },
    buildList : function() {
        this.exportList = [];
        this.buildListRec(this.root);
        // fireTableDataChanged ?
    },
    clear : function() {
        // TODO: Ensure this function works.
        this.resetCurrent();
        const q = [];
        const r = [];
        q.push(this.root);
        while(q.length > 0) {
            let e = q[0];
            q.splice(0, 1);
            r.unshift(e);
            for (let i = 0; i < q.length; i++) {
                q.push(e[i]);
            }
        }
        r.forEach((e) => {
            e.children = [];
            e.parent = null;
        });
        this.buildList();
    },
    setCurrent : function(e) {
        this.curr = e;
    },
    resetCurrent : function() {
        this.curr = this.root;
    },
    addGroup : function(name, s) {
        const e = new ListEntry(name, s, this.curr);
        this.buildList();
        this.scrollTo(e);
        this.setCurrent(e);
        return e;
    },
    scrollTo : function(e) {
        const row = this.exportList.indexOf(e);
        // TODO: @Dennis implement line 606 (scroll to in table)
    },
    /**
     * delete all selected elements from export list,
     * except for current element and its parents
     */
    deleteSelected : function() {
        // find hierarchy roots
        const rootList = [];
        this.exportList.forEach((item) => {
            if (item.parent == this.root) rootList.push(l);
        });

        // get current entry and parents
        const currList = [];
        let tmp = this.curr;
        do {
            currList.push(tmp);
            tmp = tmp.parent;
        } while (tmp != this.root);
        // prefix tree traversal: at each node:
        //   if marked for deletion && not in currList
        //     recursively add node and all children to delete list
        //   else add children to queue, progress to next node
        const delList = [];
        const noDelList = [];
        const queue = [];
        rootList.forEach( item => queue.push(item) );
        while (queue.length > 0) {
            const l = queue[0];
            queue.splice(0, 1);
            let c = l;
            let del = l.selected;
            while(c.parent != this.root) {
                c = c.parent;
                del |= c.selected;
            }
            if (del && currList.indexOf(l) < 0) {
                let p = delList.length;
                delList.push(l);
                while (p < delList.length) {
                    const d = delList[p];
                    d.children.forEach( child => delList.push(child) );
                    p++;
                }
            } else {
                if (del) noDelList.push(l);
                l.children.forEach( child => queue.push(child) );
            }
        }
        if (!(delList.length < 1 && noDelList.length < 1)) {
            let msg = "";
            if (delList.length > 0) {
                msg += "Deleting the following groups (selected groups and their child groups):\n";
                delList.forEach((entry) => {
                    for (let i = 0; i < entry.indent; i++) {
                        msg += "\t";
                    }
                    msg += entry.name +"\n";
                });
            }
            if (noDelList.length > 0) {
                msg += "Could not delete the following groups (current group and parent groups):\n";
                noDelList.forEach((entry) => {
                    for (let i = 0; i < entry.indent; i++) {
                        msg += "\t";
                    }
                    msg += entry.name + "\n";
                });
            }
            let status = document.getElementById('deleteGroupOption'); // FIXME: @Dennis implement lines 673 & 674
            if (status.value == true) {
                delList.forEach((entry) => {
                    const idx = entry.parent.children.indexOf(entry);
                    if (idx > -1) entry.parent.children.splice(idx, 1);
                    entry.parent = null;
                    entry.children = [];
                });
                this.buildList();
            }
        }
    },
    getList : function() {
        return this.exportList;
    }
};

// TODO: Implement IndentRenderer, IconRenderer, and IndentEditor?

module.exports = ExportList;
