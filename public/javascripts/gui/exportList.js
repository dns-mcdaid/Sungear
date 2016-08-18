require('javascript.util');
var TreeSet = javascript.util.TreeSet;

function ExportList(g, context) {
    this.genes = g; /** {GeneList} */
    this.context = context; /** {AppletContext} */
    this.localUpdate = false;
    this.groupCnt = 0;
    this.table = document.getElementById('controlFtable');
    this.model = new ExportModel();
    this.removeB = document.getElementById('removeB');
    this.exportB = document.getElementById('exportB');
    this.removeB.addEventListener("click", function() {
        this.model.deleteSelected();
    });
    this.exportB.addEventListener("click", function() {
        console.log("List size: " + this.model.getList().length);
        for (var i = 0; i < this.model.getList().length; i++) {
            var l = this.model.getList()[i];
            console.log(l.name + " (" + l.genes.length + ")"); // TODO: @Dennis check back to make sure it should be genes.length
        }
        this.exportGeneList();
    });
    document.getElementById('controlFtableHeader').addEventListener("click", function() {
        // Lines 115 - 119 allow the header rows to be manipulated
    });
    document.getElementById('controlFtableAdd').addEventListener("click", function() {
        this.selectAll();
    });
    // TODO: @Dennis migrate lines 124 - 152 to a private function.
    g.addGeneListener(this);
}

ExportList.prototype = {
    constructor : ExportList,
    listUpdated : function(e) {
        this.model.listUpdated(e);
    },
    /**
     * TODO: @Dennis figure this out to be less stupid.
     * @param node
     * @param row
     * @param col
     */
    addMouseListener : function(node, row, col) {
        if (row != -1) {
            var l = this.model.getList()[row];
            var s = new TreeSet();
            s.addAll(this.genes.getSelectedSet());
            this.localUpdate = true;
            switch (col) {
                case 3:
                    s.addAll(l.genes);
                    this.genes.setSelection(this, s);
                    break;
                case 4:
                    s = new TreeSet();
                    s.addAll(l.genes);
                    this.genes.setSelection(this, s);
                    break;
                case 5:
                    for (var i = 0; i < l.genes.length; i++) {
                        s.remove(l.genes[i]);
                    }
                    this.genes.setSelection(this, s);
                    break;
                case 6:
                    this.model.setCurrent(l);
                    this.genes.setActive(this, l.genes);
                    // TODO: Possibly impelement a table.repaint?
                    break;
            }
            this.localUpdate = false;
        }
    }

};

function ListEntry(name, genes, parent) {
    this.name = name;       /** {String} */
    this.genes = genes;     /** {SortedSet<Gene>} */
    this.parent = parent;   /** {ListEntry} */
    this.selected = false;  /** {boolean} */
    this.children = [];     /** {Vector<ListEntry>} */
    if (this.parent !== null) {
        parent.addChild(this);
    }
    this.indent = (this.parent === null ? 0 : this.parent.indent+1);    /** {int} */
    this.extra = {};        /** {Hashtable<Object, Object>} */
}

ListEntry.prototype = {
    constructor : ListEntry,
    addChild : function(c) {
        this.children.push(c);
    },
    removeChild : function(c) {
        var index = this.children.indexOf(c);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }
};

function ExportModel() {
    this.titles = [ "+/-", "Name", "", "", "", "", "" ];
    this.setType("Items");
    this.goI = document.createElement('span');
    this.goI.className = "glyphicon glyphicon-play";
    this.unI = document.createElement('span');
    this.unI.className = "glyphicon glyphicon-plus-sign";
    this.intI = document.createElement('span');
    this.intI.className = "glyphicon glyphicon-adjust";
    this.subI = document.createElement('span');
    this.subI.className = "glyphicon glyphicon-minus-sign";
    this.exportList = [];
    this.root = new ListEntry("root", new TreeSet(), null);
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
        } else {

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
        if (r != root) {
            this.exportList.push(r);
        }
        for (var i = 0; i < r.children.length; i++) {
            this.buildListRec(r.children[i]);
        }
    },
    buildList : function() {
        this.exportList = [];
        this.buildListRec(this.root);
        // fireTableDataChanged ?
    },
    clear : function() {
        // TODO: Ensure this function works.
        this.resetCurrent();
        var q = [];
        var r = [];
        q.push(this.root);
        while(q.length > 0) {
            var e = q[0];
            q.splice(0, 1);
            r.unshift(e);
            for (var i = 0; i < q.length; i++) {
                q.push(e[i]);
            }
        }
        for (var it = 0; it < r.length; i++) {
            var e = r[it];
            e.children = [];
            e.parent = null;
        }
        this.buildList();
    },
    setCurrent : function(e) {
        this.curr = e;
    },
    resetCurrent : function() {
        this.curr = this.root;
    },
    addGroup : function(name, s) {
        var e = new ListEntry(name, s, this.curr);
        this.buildList();
        this.scrollTo(e);
        this.setCurrent(e);
        return e;
    },
    scrollTo : function(e) {
        var row = this.exportList.indexOf(e);
        // TODO: @Dennis implement line 606 (scroll to in table)
    },
    /**
     * delete all selected elements from export list,
     * except for current element and its parents
     */
    deleteSelected : function() {
        // find hierarchy roots
        var rootList = [];
        var l = null;
        var it = 0;
        var i = 0;
        for (it = 0; it < this.exportList.length; it++) {
            l = this.exportList[it];
            if (l.parent == this.root) {
                rootList.push(l);
            }
        }
        // get current entry and parents
        var currList = [];
        var tmp = this.curr;
        do {
            currList.push(tmp);
            tmp = tmp.parent;
        } while (tmp != this.root);
        // prefix tree traversal: at each node:
        //   if marked for deletion && not in currList
        //     recursively add node and all children to delete list
        //   else add children to queue, progress to next node
        var delList = [];
        var noDelList = [];
        var queue = [];
        for (i = 0; i < rootList.length; i++) {
            queue.push(rootList[i]);
        }
        while (queue.length > 0) {
            l = queue[0];
            queue.splice(0, 1);
            var c = l;
            var del = l.selected;
            while(c.parent != this.root) {
                c = c.parent;
                del |= c.selected;
            }
            if (del && currList.indexOf(l) < 0) {
                var p = delList.length;
                delList.push(l);
                while (p < delList.length) {
                    var d = delList[p];
                    for (i = 0; j < d.children.length; i++) {
                        delList.push(d[i]);
                    }
                    p++;
                }
            } else {
                if (del) {
                    noDelList.push(l);
                }
                for (i = 0; i < l.children.length; i++) {
                    queue.push(l[i]);
                }
            }
        }
        if (!(delList.length < 1 && noDelList.length < 1)) {
            var msg = "";
            if (delList.length > 0) {
                msg += "Deleting the following groups (selected groups and their child groups):\n";
                for (it = 0; it < delList.length; i++) {
                    l = delList[it];
                    for (i = 0; i < l.indent; i++) {
                        msg += "\t";
                    }
                    msg += l.name + "\n";
                }
            }
            if (noDelList.length > 0) {
                msg += "Could not delete the following groups (current group and parent groups):\n";
                for (it = 0; it < noDelList.length; it++) {
                    l = noDelList[it];
                    for (i = 0; i < l.indent; i++) {
                        msg += "\t";
                    }
                    msg += l.name + "\n";
                }
            }
            var status = 0; // FIXME: @Dennis implement lines 673 & 674
            if (status == OK_OPTION) {
                for (it = 0; it < delList.length; it++) {
                    l = delList[it];
                    var idx = l.parent.children.indexOf(l);
                    if (idx > -1) {
                        l.parent.children.splice(idx, 1);
                    }
                    l.parent = null;
                    l.children = [];
                }
                this.buildList();
            }
        }
    },
    getList : function() {
        return this.exportList;
    },
    listUpdated : function(e) {
        console.log("Export list updated!");
    }
};

module.exports = ExportList;