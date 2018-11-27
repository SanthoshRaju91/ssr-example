const http = require("http");

const monitor = (options, mediator) => {
  const request = http.get(options.MONI_URL, response => {
    if (response.statusCode === 200) {
      let log = {
        time: Date.now(),
        status: "UP"
      };

      mediator.emit("push.events", log);
    }
  });

  request.on("error", err => {
    if (err.errno === "ECONNREFUSED") {
      let log = {
        time: Date.now(),
        status: "DOWN"
      };

      mediator.emit("push.events", log);
    }
  });
};

module.exports = monitor;
