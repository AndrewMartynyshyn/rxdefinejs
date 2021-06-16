var express = require("express");
var app = express();
var cookieParser = require("cookie-parser");

app.use(cookieParser());

app.get("*", function (req, res, next) {
  var cookie = req.cookies.cookieName;
  if (cookie === undefined) {
    // no: set a new cookie
    var randomNumber = Math.random().toString();
    randomNumber = randomNumber.substring(2, randomNumber.length);
    res.cookie("cookieName", randomNumber, {
      sameSite: "none",
      secure: true,
      maxAge: 900000,
      httpOnly: true,
    });
    console.log("cookie created successfully");
  } else {
    // yes, cookie was already present
    console.log("cookie exists", cookie);
  }
  next();
});

app.use("/static", express.static("static"));

const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log("process env is: " + process.env.PORT);
console.log("App listening on port " + PORT);
