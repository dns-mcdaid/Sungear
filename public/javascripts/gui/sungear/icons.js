/** DONE */

function ArrowIcon(type, scale, plain, highlight, select, fill) {
    this.arrowX = [0, 2, 0, 0,-2,-2,0];
    this.arrowY = [2, 0,-2,-1,-1, 1,1];
    this.type = type;
    this.scale = scale;
    this.plain = plain;
    this.highlight = highlight;
    this.select = select;
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
        p5.push();
        p5.translate(x + 2 * this.scale, y + 2 * this.scale);
        p5.rotate(.5 * Math.PI * this.type);
        p5.scale(this.scale, this.scale);
        // p5.strokeWeight(.5);
        p5.noStroke();
        if (p5.dist(p5.mouseX, p5.mouseY, x+4, y+4) < this.scale*2) {
            if (p5.mouseIsPressed) {
                p5.fill(this.select);
            } else {
                p5.fill(this.highlight);
            }
        } else {
            // p5.strokeWeight(.3);
            // p5.fill("#111111");
            // p5.stroke(this.plain);
            p5.fill(this.plain);
        }
        p5.beginShape();
        for (var i = 0; i < this.arrowX.length; i++) {
            p5.vertex(this.arrowX[i], this.arrowY[i]);
        }
        p5.endShape(p5.CLOSE);
        p5.pop();
    }
};

function VesselMinIcon(plain, highlight, select, steps, stepSize, step) {
    this.plain = plain;
    this.highlight = highlight;
    this.select = select;
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
        p5.noStroke();
        p5.ellipseMode(p5.CENTER);
        for (var i = this.steps - 1; i >= 0; i--) {
            if (this.step == i) {
                p5.fill(this.select);
            } else {
                if (p5.dist(p5.mouseX, p5.mouseY, x, y) < this.stepSize * this.steps) {
                    p5.fill(this.highlight);
                } else {
                    p5.fill(this.plain);
                }
            }
            var sz = this.stepSize * (i+1) * 2;
            p5.ellipse(x, y, sz, sz);
        }
        p5.pop();
    }
};

function ShowArrowIcon(plain, highlight, select, arrow) {
    this.plain = plain;
    this.highlight = highlight;
    this.select = select;
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
        p5.push();
        // Set color and build oval
        if (p5.dist(p5.mouseX, p5.mouseY, x, y) < 7) {
            if (p5.mouseIsPressed) {
                p5.stroke(this.select);
                p5.fill(this.select);
            } else {
                p5.stroke(this.highlight);
                p5.fill(this.highlight);
            }
        } else {
            p5.stroke(this.plain);
            p5.fill(this.plain);
        }
        p5.ellipse(x, y, 7, 7);
        p5.translate(x, y);
        for (var i = 0; i < 4; i++) {
            p5.push();
            p5.rotate(i*2*Math.PI/4.0);
            p5.translate(1, -.5);
            p5.line(4, 0, 7, 0);
            p5.line(7, 0, 7-ShowArrowIcon.A, -ShowArrowIcon.A);
            p5.line(7, 0, 7-ShowArrowIcon.A, ShowArrowIcon.A);
            p5.pop();
        }
        p5.pop();
    }
};

function EllipseIcon(scale, plain, highlight, select, fill) {
    this.ellipse = {
        x : -2,
        y : -2,
        w : 4,
        h : 4
    };
    this.scale = scale;
    this.plain = plain;
    this.highlight = highlight;
    this.select = select;
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
        p5.push();
        p5.translate(x+2*this.scale, y+2*this.scale);
        p5.scale(this.scale, this.scale);
        // p5.strokeWeight(.5);
        p5.noStroke();
        if (p5.dist(p5.mouseX, p5.mouseY, x, y) < 2*this.scale) {
            if (p5.mouseIsPressed) {
                p5.fill(this.select);
            } else {
                p5.fill(this.highlight);
            }
        } else {
            // p5.strokeWeight(.5);
            // p5.fill("#111111");
            // p5.stroke(this.plain);
            p5.fill(this.plain);
        }
        p5.ellipse(this.ellipse.x, this.ellipse.y, this.ellipse.w, this.ellipse.h);
        p5.pop();
    }
};

function StatsIcon(plain, highlight, select) {
    this.plain = plain;
    this.highlight = highlight;
    this.select = select;
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
    paintIcon : function(c, p5, x, y) {
        p5.push();
        if (p5.dist(p5.mouseX, p5.mouseY, x+(this.W/2), y+(this.H/y)) < this.H) {
            if (p5.mouseIsPressed) {
                p5.stroke(this.select);
            } else {
                p5.stroke(this.highlight);
            }
        } else {
            p5.stroke(this.plain);
        }
        for (var i = 0; i < 3; i++) {
            p5.line(x+7*i, y+0, x+7*i, y+this.H-1);
        }
        for (i = 0; i < 6; i++) {
            p5.line(x+0, y+3*i, x+this.W-1, y+3*i);
        }
        p5.pop();
    }
};

module.exports = {
    ArrowIcon : ArrowIcon,
    VesselMinIcon : VesselMinIcon,
    ShowArrowIcon : ShowArrowIcon,
    EllipseIcon : EllipseIcon,
    StatsIcon : StatsIcon
};