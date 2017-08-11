const updateWallpaper = require('./updateWallpaper');
const isNight = require('./isNight');

module.exports = (() => {
    isNight("today", (sunset, sunrise, night) => {
        updateDelay(sunset, sunrise, night);
    });
})();

const cb = (sunset, sunrise) => {
    const now = new Date();
    const min = sunrise.getTime() - now.getTime();
    setTimeout(function () {
        updateDelay(sunset, sunrise, true)
    }, min);
};
function updateDelay(sunset, sunrise, night) {
    updateWallpaper(night);
    (night) ?
        isNight("tomorrow", (sun, sunr) => {
            cb(sun, sunr)
        })  :
        cb(sunset, sunrise)
}