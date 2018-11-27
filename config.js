const config = {
  PORT: process.env.PORT || 3000,
  MONI_URL: "http://localhost:4200",
  interval: 5000
};

module.exports = Object.assign({}, config);
