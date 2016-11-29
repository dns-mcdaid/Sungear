"use strict";
/**
 * Comp specifies different functions for comparing Vessels:
 * Number of Active Genes
 * Number of Anchors
 * Number of Selected Genes
 *
 * Also provided is a CoolVessel class. I have no idea what makes a vessel cool though, maybe it smokes cigarettes?
 *
 * @author RajahBimmy
 */
function VesselActSize() {}
/**
 * Compares vessels based on number of Active Genes
 * @param v1 {VesselDisplay}
 * @param v2 {VesselDisplay}
 * @returns {number}
 */
VesselActSize.prototype.compare = function(v1, v2) {
    return v2.getActiveCount() - v1.getActiveCount();
};

/**
 * @param vessel {VesselDisplay}
 * @param score {number} double
 * @param count {number} int
 * @constructor
 */
function CoolVessel(vessel, score, count) {
    this.vessel = vessel;
    this.score = score;
    this.count = count;
}

CoolVessel.prototype.compareTo = function(o) {
    if (o.score != this.score) {
        return (o.score > this.score) ? 1 : -1;
    } else if (o.count != this.count) {
        return o.count - this.count;
    } else {
        return this.vessel.toString().localeCompare(o.vessel.toString());
    }
};

CoolVessel.prototype.compare = function(o) {
    if (o.score != this.score) {
        return (o.score > this.score) ? 1 : -1;
    } else if (o.count != this.count) {
        return o.count - this.count;
    } else {
        return this.vessel.toString().localeCompare(o.vessel.toString());
    }
};

function VesselACount() {}
/**
 * Compares vessels based on number of Anchors
 * @param v1 {VesselDisplay}
 * @param v2 {VesselDisplay}
 * @returns {number}
 */
VesselACount.prototype.compare = function(v1, v2) {
    if (v1 === null || v2 === null) return -1;

    if (v1.anchor.length < v2.anchor.length) {
        return -1;
    } else if (v1.anchor.length > v2.anchor.length) {
        return 1;
    } else {
        return 0;
    }
};

function VesselSelSize() {}
/**
 * Compares vessels based on number of Selected Genes
 * @param v1 {VesselDisplay}
 * @param v2 {VesselDisplay}
 * @returns {number}
 */
VesselSelSize.prototype.compare = VesselSelSize.prototype.compareTo = function(v1, v2) {
    return v2.getSelectedCount() - v1.getSelectedCount();
};

module.exports = {
    VesselActSize : VesselActSize,
    CoolVessel : CoolVessel,
    VesselACount : VesselACount,
    VesselSelSize : VesselSelSize
};