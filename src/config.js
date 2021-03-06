const path = require("path");

const APP_NAME = "voxpop";
const APP_VERSION = require("./../package.json").version;

let ENV_TRACKER_ANNOUNCE_LIST = false;

if (process.env.VUE_APP_TRACKER_ANNOUNCE_LIST) {
  try {
    ENV_TRACKER_ANNOUNCE_LIST = JSON.parse(process.env.VUE_APP_TRACKER_ANNOUNCE_LIST || "false");
  } catch (e) {
    ENV_TRACKER_ANNOUNCE_LIST = false;
  }
}

module.exports = {
  APP_NAME,
  APP_VERSION,
  WINDOW_WEBTORRENT: `file://${path.join(__dirname, "..", "static", "webtorrent.html")}`,
  TRACKER_ANNOUNCE_LIST: ENV_TRACKER_ANNOUNCE_LIST || [["ws://voxpopgames.com:8000"], ["udp://voxpopgames.com:8000"]],
  //TRACKER_ANNOUNCE_LIST: ENV_TRACKER_ANNOUNCE_LIST || [["ws://157.230.135.10:8000"], ["udp://157.230.135.10:8000"]],
  //TRACKER_ANNOUNCE_LIST: ENV_TRACKER_ANNOUNCE_LIST || [
  //["ws://voxpopapi4-env.eba-iddwavqf.us-east-2.elasticbeanstalk.com"],
  //["udp://voxpopapi4-env.eba-iddwavqf.us-east-2.elasticbeanstalk.com"]
  //],
  PIECE_LENGTH: 1024 * 1024 // 1MB
};
