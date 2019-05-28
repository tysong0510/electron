const path = require("path");

const APP_NAME = "voxpop";
const APP_VERSION = require("./../package.json").version;

module.exports = {
  APP_NAME,
  APP_VERSION,
  WINDOW_WEBTORRENT: `file://${path.join(__dirname, "..", "static", "webtorrent.html")}`,
  // TRACKER_ANNOUNCE_LIST: [["ws://157.230.135.10:8000"], ["udp://157.230.135.10:8000"]],
  TRACKER_ANNOUNCE_LIST: [["ws://www.voxpopgames.com:8000"], ["udp://www.voxpopgames.com:8000"]],
  PIECE_LENGTH: 1024 * 1024 // 1MB
};
