// TODO: @Dennis find out if this is necessary.

var DelayTimer = require('./delayTimer');
var CursorManager = require('./cursorManager');

function WaitCursorEventQueue(delay) {
    this.waitTimer = new DelayTimer(this, delay);
    this.cursorManager = new CursorManager(this.waitTimer);
}