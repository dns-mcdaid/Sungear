// TODO: @Dennis find out if this is necessary

/**
 * This class implements a delay timer that will call trigger()
 * on the DelayTimerCallback delay milliseconds after
 * startTimer() was called, if stopTimer() was not called first.
 * The timer will only throw events after startTimer() is called.
 * Until then, it does nothing.  It is safe to call stopTimer()
 * and startTimer() repeatedly.
 *
 * Note that calls to trigger() will happen on the timer thread.
 *
 * This class is multiple-thread safe.
 */

/**
 * @param callback {DelayTimerCallback}
 * @param delay {long}
 * @constructor
 */
function DelayTimer(callback, delay) {
    this.callback = callback;
    this.delay = delay;

    this.setDaemon(true);
    this.start();
}

DelayTimer.prototype = {
    constructor : DelayTimer,
    /**
     * Calling this method twice will reset the timer.
     */
    startTimer : function() {

    },
    stopTimer : function() {

    },

};