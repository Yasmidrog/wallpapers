const cheerio = require('cheerio');

const Canvas = require('canvas');
const request = require('request');
const path = process.cwd();
const fs = require('fs');
const Rsvg = require('librsvg').Rsvg;
const vk = require("./vk");
const url = 'http://frtmix.github.io';

module.exports = function (isNight) {
    Canvas.registerFont(path + '/static/Lato-Regular.ttf', {family: 'Lato'});
    let canvas = new Canvas(1590, 400);
    const ctx = canvas.getContext('2d');
    if (isNight) {
        ctx.fillStyle = '#0c0c0c';
    } else {
        ctx.fillStyle = '#FFF';
    }

    ctx.fillRect(0, 0, 1590, 400);

    ctx.font = "40px Lato Regular";


    if (isNight) {
        ctx.fillStyle = '#FFF';
    } else {
        ctx.fillStyle = '#0c0c0c';
    }

    ctx.textAlign = "center";

    const arrowl = new Canvas.Image;
    arrowl.src = fs.readFileSync(path + "/static/arrowl.png");
    ctx.drawImage(arrowl, 100, 185, 30, 30);

    request(url, function (error, response, body) {
        let $ = cheerio.load(body);
        let projlist_wrap = $('.projlist_wrap');

        const len = $(projlist_wrap).length;

        $(projlist_wrap).each(function (index, entry) {
            if (index < 3) {
                const caption = $(entry).find($('.caption')).text();
                const pic_src = url + "/" + $(entry).find('a').find('img').attr('src');
                const pic = new Canvas.Image;
                let svg = new Rsvg();
                svg.on('finish', function () {
                    pic.src = svg.render({
                        format: 'png',
                        width: svg.width,
                        height: svg.height
                    }).data;

                    console.log(caption);
                    const args = [
                        [[295, 60, 200, 200], [395, 350]],
                        [[695, 60, 200, 200], [795, 350]],
                        [[1095, 60, 200, 200], [1195, 350]]
                    ];
                    ctx.drawImage(pic, ...(args[index][0]));
                    ctx.fillText("«" + caption + "»", ...(args[index][1]));

                    if (index < 3) {
                        if (index === len - 1) {
                            write(canvas)
                        }
                    } else {
                        if (index === 2) {
                            write(canvas);
                        }
                    }
                });

                console.log(pic_src);

                request(pic_src).pipe(svg);
            }
        })
    });
}


function write(canvas) {
    let out = fs.createWriteStream(path + '/static/cover.png'), stream = canvas.pngStream();

    stream.on('data', function (chunk) {
        out.write(chunk);
    });

    stream.on('end', function () {
        console.log('saved png');

        vk.api.photos.getOwnerCoverPhotoUploadServer({
            'crop_x2': '1590',
            'crop_y2': '400',
            'group_id': '95612745'
        }).then((group) => {
            const upload_url = group.upload_url;
            const formData = {
                photo: fs.createReadStream(path + '/static/cover.png'),
            };

            request.post({url: upload_url, formData: formData}, function (err, httpResponse, body) {
                if (err) throw err;
                const body_json = JSON.parse(body);
                console.log(body_json);
                const hash = body_json.hash;
                const photo = body_json.photo;
                vk.api.photos.saveOwnerCoverPhoto({'hash': hash, 'photo': photo}).then(() => {
                    console.log("Сохранено.");
                }).catch((error) => {
                    console.error(error);
                });
            });
        }).catch((error) => {
            console.error(error);
        });
    });
}