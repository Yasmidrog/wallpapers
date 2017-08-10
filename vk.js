const VK = require('vk-io');
const vk_key = require("./config").VK_KEY;
let vk = new VK();
vk.setToken(vk_key);
module.exports=vk;