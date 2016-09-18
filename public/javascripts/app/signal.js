/**
 * Signal is an enum class which allows visGene to send p5
 * unusual commands beyond just drawings.
 * Most of these are triggered by clicking on the top navbar in the app,
 * and can likely be refactored out into something a little smarter for a future implementation.
 *
 * @type {{LOAD: number, SCREENSHOT: number, FULLSCREEN: number}}
 *
 * @author RajahBimmy
 */
module.exports = {
    LOAD : 0,
    SCREENSHOT : 1,
    FULLSCREEN : 2
};