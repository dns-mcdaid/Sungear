/**
 *  Main GeneLights panel to show experiments as line segments and
 *  the selected genes distribution via histograms.
 */

function LinePanel(genes) {
    this.genes = genes;
    // this component, linePanel, can send GeneEvent
    genes.addGeneListener(this);
    genes.addMultiSelect(this);
    this.readInputFinished = false;
    // initially geneLights Frame is iconified
    this.geneLightsFIconified = true;
    this.inputURL = null;
    this.hasInput = false;
    this.mySelection = [];

    this.stringTopGap = 5.0;
    this.leftX = 50.0;
    this.topY = 55.0;
    this.refLineY = 30.0;
    this.debug = false;
    this.select = false;
    this.clicked = false;
    this.drag = false;
    this.stayDrag = false;
    this.topselection = false;
    this.stayLight = false;
    this.ctrl = false;
    this.alt = false;
    this.boxed = false;
    this.reverse = false;
    this.offset = 1;
    this.onposx = -100;
    this.onposy = -100;
}

LinePanel.MAXLINELENGTH = 400.0;
LinePanel.NUMOFBUCKETS = 20;
LinePanel.MAXBARHEIGHT = 20.0;
LinePanel.TOP_BUCKET_PERCENT = 0.1;
LinePanel.ENDGAP = 5.0;

module.exports = LinePanel;