function GoTerm(genes, fd) {
    this.genes = genes;
    this.geneThresh = 1;
    this.multi = false;
    this.collapsed = false;
    this.lastRowList = -1;
    this.terms = {};
    this.uniq = new TreeSet();
    this.all = new TreeSet();
    this.assocGenes = new TreeSet();
    this.tree = null; // TODO: @Dennis figure out how to implement a file tree.
    
}

GoTerm.sortOptions = [ "Sort by Z-Score", "Sort by Name", "Sort by Count" ];

module.exports = GoTerm;