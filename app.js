const config = require("./config");
const monitor = require("./monitor");
const server = require("./server");

const { EventEmitter } = require("events");

const mediator = new EventEmitter();

// this is for persisting connections array;
const connections = [];
// this is for persisting response monitor logs;
const logResponse = [];

// event capture on application boot.ready
mediator.on("boot.ready", () => {
  server
    .connect({
      ...config,
      mediator
    })
    .then(() => {
      console.log(`Server ready on PORT - ${config.PORT}`);
      mediator.emit("monitor");
    })
    .catch(err => {
      console.error(`Unable to start server on PORT - ${config.PORT}`);
      console.error(err);
    });
});

// event capture on a new client.connected
mediator.on("client.connected", res => {
  connections.push(res);
});

// event capture on a push.events
mediator.on("push.events", data => {
  console.log(data);
  logResponse.push(data);

  for (let i = 0; i < connections.length; i++) {
    connections[i].sseSend(logResponse);
  }
});

// event capture on monitor
mediator.on("monitor", () => {
  setInterval(() => monitor(config, mediator), config.interval);
});

mediator.emit("boot.ready");
