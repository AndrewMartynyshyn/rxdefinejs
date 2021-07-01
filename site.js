var express = require("express");
var app = express();
var cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://fake-pharma.netlify.app");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", true);
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

  for (const [key, value] of Object.entries(req.body)) {
    res.cookie(key, value, {
      sameSite: "none",
      secure: true,
      maxAge: 14 * 24 * 3600000,
      httpOnly: true,
      path: "/",
    });
  }

  res.json({
    ...req.body,
    rxid: rxid || "NONE",
  });
});

app.post("/utms", function (req, res) {
  res.json({
    ...req.body,
  });
});

app.post("/rx", function (req, res) {
  res.json({
    rx_id: "someidhere",
  });
});

app.use("/static", express.static("static"));

const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log("process env is: " + process.env.PORT);
console.log("App listening on port " + PORT);
