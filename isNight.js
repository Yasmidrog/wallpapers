const request = require('request');
const wurl=require("./config").WALL_URL
module.exports = function (when, callback) {
    const url = wurl + when + "&formatted=0";
    request(url, function (err, res, body) {
        const json = JSON.parse(body).results;
        const sunrise = new Date(json.sunrise);
        const sunset = new Date(json.sunset);
        const now = new Date();
        callback(sunset, sunrise, (
            now.getTime() <= sunrise.getTime()||now.getTime() >= sunset.getTime()
        ));
    });
};
