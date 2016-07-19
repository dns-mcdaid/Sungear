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
}

module.exports = ExportList;