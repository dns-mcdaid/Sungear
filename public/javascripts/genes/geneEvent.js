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