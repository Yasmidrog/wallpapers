const updateWallpaper = require('./updateWallpaper.js');
const vk=require("./vk")
const request = require('request');
const isNight = require('./isNight');
const secret = require("./config").SECRET;
const http = require('http');
const port = process.env.WALLPORT || 1339;
const server = http.createServer(function (req, res) {
    let jsondata= "";
    req.on('data', function (chunk) {
        jsondata += chunk;
    });
    req.on('end', function () {
        const body = JSON.parse(jsondata);
        console.log(body);
        const object = body.object;
        const sercet_inp = body.secret;
        const group_id = body.group_id;
        if (secret === sercet_inp) {
            if (body.type === 'message_new') {
                if (object.body.includes('/update')) {
                    const id = object.user_id;
                    vk.api.groups.getMembers({'filter': 'managers', 'group_id': group_id}).then(
                        (group) => {
                        const str = JSON.stringify(group);
                        if (str.includes(id)) {
                            vk.api.messages.markAsAnsweredDialog({'peer_id': id, 'answered': 1}).then(() => {
                                vk.api.messages.markAsRead({'peer_id': id}).then(() => {
                                    isNight("today", (sunset, sunrise, night) => {
                                        updateWallpaper(night);
                                    });
                                });
                            });
                        }
                    }).catch((error) => {
                        console.error(error);
                    });
                }
            } else if (body.type === 'post_new') {
                if (object.body.includes('#projects@frtmx')) {
                    isNight("today", (sunset, sunrise, night) => {
                        updateWallpaper(night);
                    });
                }
            }
        }
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('ok');
    })
}).on('error', function (e) {
    console.log(e)
});
server.listen(port);
updateWallpaper();
require('./regular');
