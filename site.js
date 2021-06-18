var express = require("express");
var app = express();
var cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("*", function (req, res, next) {
  var rxid = req.cookies.rxid;

  if (rxid === undefined) {
    var randomNumber = Math.random().toString();
    randomNumber = randomNumber.substring(2, randomNumber.length);
    res.cookie("rxid", randomNumber, {
      sameSite: "none",
      secure: true,
      maxAge: 14 * 24 * 3600000,
      httpOnly: true,
      path: "/",
    });
  }

  next();
});

app.post("/data", function (req, res) {
  var rxid = req.cookies.rxid;

  res.json({
    ...req.body,
    rxid: req.cookies.rxid || "NONE",
  });
});

app.use("/static", express.static("static"));

const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log("process env is: " + process.env.PORT);
console.log("App listening on port " + PORT);
