const express = require("express");
const apicache = require("apicache");
const path = require("path");

const app = express();
let cache = apicache.middleware;

// 跨域设置
app.all("*", function(req, res, next) {
  if (req.path !== "/" && !req.path.includes(".")) {
    res.header("Access-Control-Allow-Credentials", true);
    // 这里获取 origin 请求头 而不是用 *
    res.header("Access-Control-Allow-Origin", req.headers["origin"] || "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
  }
  next();
});

const onlyStatus200 = (req, res) => res.statusCode === 200;

app.use(cache("2 minutes", onlyStatus200));

app.use(express.static(path.resolve(__dirname, "public")));

app.use(function(req, res, next) {
  const proxy = req.query.proxy;
  if (proxy) {
    req.headers.cookie = req.headers.cookie + `__proxy__${proxy}`;
  }
  next();
});

// 获取专辑内容
app.use("/album", require("./router/album"));




const port = process.env.PORT || 3004;

app.listen(port, () => {
  console.log(`server running @ http://localhost:${port}`);
});

module.exports = app;
