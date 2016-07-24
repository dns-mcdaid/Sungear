/**
 * @param genes {GeneList}
 * @param thresh {float}
 * @constructor
 */
function SetTool(genes, thresh) {
    this.genes = genes;
    this.thresh = thresh;
    var s = genes.getGenesSet();
    this.anchors = genes.getSource().getReader().anchors.toArray(); /** {Anchor[]} */
    this.exp = [];  /** {float[][]} */
    var n = 0;
    for (var it = s.iterator(); it.hasNext(); ) {
        var g = it.next();
        var e = g.getExp();
        for (var i = 0; i < this.anchors.length; i++) {
            this.exp[i][n] = e[i];
        }
        n++;
    }
    for (i = 0; i < this.exp.length; i++) {
        this.exp[i].sort();
    }
    this.gmin = Number.MAX_VALUE;
    this.gmax = Number.MIN_VALUE;
    for (i = 0; i < this.exp.length; i++) {
        this.gmin = (this.exp[i][0] < this.gmin) ? this.exp[i][0] : this.gmin;
        this.gmax = (this.exp[i][this.exp[i].length-1] > this.gmax) ? this.exp[i][this.exp[i].length-1] : this.gmax;
    }
    // TODO: Implement the GUI part of this.
}

module.exports = SetTool;