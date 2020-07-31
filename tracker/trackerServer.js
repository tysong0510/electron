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

server.on("listening", function() {
  // fired when all requested servers are listening
  console.log("listening on http port:" + server.http.address().port);
  console.log("listening on udp port:" + server.udp.address().port);
});

server.listen(port, host, () => {
  console.log("onlistening...");
});

server.on("start", function(addr) {
  console.log("got start message from " + addr);
});

server.on("complete", function(addr) {
  console.log("got complete message from " + addr);
});
server.on("update", function(addr) {
  console.log("got update message from " + addr);
});
server.on("stop", function(addr) {
  console.log("got stop message from " + addr);
});
