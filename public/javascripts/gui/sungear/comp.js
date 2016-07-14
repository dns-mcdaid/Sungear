VesselActSize.compare = function(v1, v2) {
    return v2.getActiveCount() - v1.getActiveCount();
};

function CoolVessel(vessel, score, count) {
    this.vessel = vessel;   /** @type VesselDisplay */
    this.score = score;     /** @type double */
    this.count = count;     /** @type int */
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

VesselACount.compare = function(v1, v2) {
    if (v1.anchor.length < v2.anchor.length) {
        return -1;
    } else if (v1.anchor.length > v2.anchor.length) {
        return 1;
    } else {
        return 0;
    }
};

VesselSelSize.compare = function(v1, v2) {
    return v2.getSelectedCount() - v1.getSelectedCount();
};