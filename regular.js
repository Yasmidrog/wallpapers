const updateWallpaper = require('./updateWallpaper');
const isNight = require('./isNight');

module.exports = (() => {
    isNight("today", (sunset, sunrise, night) => {
        updateDelay(sunset, sunrise, night);
    });
})();

const cb = (sunset, sunrise, night) => {
    const now = new Date();
    night = true;
    const min = sunrise.getTime() - now.getTime();
    setTimeout(function () {
        updateDelay(sunset, sunrise, night)
    }, min);
};
function updateDelay(sunset, sunrise, night) {
    updateWallpaper(night);
    (night) ?
        isNight("tomorrow", (sunset, sunrise, night) => {
            cb(sunset, sunrise, night)
        })  :
        cb(sunset, sunrise, night)
}