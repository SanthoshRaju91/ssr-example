const express = require("express");
const morgan = require("morgan");
const path = require("path");
const sse = require("./sse");

const app = express();

const connect = options => {
  return new Promise((resolve, reject) => {
    app.use(morgan("dev"));
    app.use(sse);

    app.engine("jade", require("jade").__express);
    app.set("view engine", "jade");

    app.get("/", (__, res) => {
      res.sendFile(path.join(__dirname, "views", "dashboard.html"));
    });

    app.get("/result", (__, res) => {
      res.render("result");
    });

    app.get("/stream", (__, res) => {
      res.sseSetup();
      res.sseSend();
      options.mediator.emit("client.connected", res);
    });

    app.listen(options.PORT, err => {
      if (err) reject();
      resolve();
    });
  });
};

module.exports = Object.assign({}, { connect });
