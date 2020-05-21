let port = 8000;
let host = "0.0.0.0";

var Server = require("bittorrent-tracker").Server;

var server = new Server({
  udp: true,
  ws: true,
  stats: true,
  filter: function(infoHash, params, cb) {
    let allowed = true;
    console.log("infoshash", infoHash);
    console.log("params", params);

    if (allowed) {
      cb(null);
    } else {
      cb(new Error("disallowed torrent"));
    }
  }
});

server.on("error", function(err) {
  console.log(err.message);
});

server.on("warning", function(err) {
  console.log(err.message);
});

server.listen(port, host, () => {
  console.log("onlistening...");
});
