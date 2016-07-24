function ArrowIcon(type, scale, color, fill) {
    this.type = type;
    this.scale = scale;
    this.color = color;
    this.fill = fill;
}

ArrowIcon.prototype = {
    constructor : ArrowIcon,
    getIconWidth : function() {
        return this.scale * 4;
    },
    getIconHeight : function() {
        return this.scale * 4;
    },
    paintIcon : function(c, p5, x, y) {
        
    }
};

function VesselMinIcon(color, steps, stepSize, step) {
    this.color = color;
    this.steps = steps;
    this.stepSize = stepSize;
    this.step = step;
    this.W = 2 * steps * stepSize;
    this.H = this.W;
}

VesselMinIcon.prototype = {
    constructor : VesselMinIcon,
    getIconWidth : function() {
        return this.W;
    },
    getIconHeight : function() {
        return this.H;
    },
    paintIcon : function(c, p5, x, y) {
        p5.push();
        for (var i = this.steps -1; i >= 0; i--) {
            // TODO: Finish
        }
        p5.pop();
    }
};

function ShowArrowIcon(color, arrow) {
    this.color = color;
    this.arrow = arrow;
}

ShowArrowIcon.W = 15;
ShowArrowIcon.H = 15;
ShowArrowIcon.A = 2;

ShowArrowIcon.prototype = {
    constructor : ShowArrowIcon,
    getIconWidth : function() {
        return ShowArrowIcon.W;
    },
    getIconHeight : function() {
        return ShowArrowIcon.H;
    },
    paintIcon : function(c, p5, x, y) {

    }
};

function EllipseIcon(scale, color, fill) {
    this.scale = scale;
    this.color = color;
    this.fill = fill;
}

EllipseIcon.prototype = {
    constructor : EllipseIcon,
    getIconWidth : function() {
        return this.scale * 4;
    },
    getIconHeight : function() {
        return this.scale * 4;
    },
    paintIcon : function(c, p5, x, y) {

    }
};

function StatsIcon(color) {
    this.color = color;
    this.W = 15;
    this.H = 16;
}

StatsIcon.prototype = {
    constructor : StatsIcon,
    getIconWidth : function() {
        return this.W;
    },
    getIconHeight : function() {
        return this.H;
    },
    paintIcon : function(c, g, x, y) {

    }
};

module.exports = {
    ArrowIcon : ArrowIcon,
    VesselMinIcon : VesselMinIcon,
    ShowArrowIcon : ShowArrowIcon,
    EllipseIcon : EllipseIcon,
    StatsIcon : StatsIcon
};