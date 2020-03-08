const result = require("dotenv").config({ path: "config.env" });
const session = require("cookie-session");
const helmet = require("helmet");
const cookie = require("cookies");
const bodyParser = require("body-parser");
const path = require("path");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const app = require("./app.js");
console.log(app);

var sess = {
  secret: process.env.SESSION_SECRET,
  options: {
    maxAge: 24 * 60 * 60 * 1000,
    secure: false,
    overwrite: false
  }
};

if (process.env === "production") {
  app.set("trust proxy", 1);
  sess.cookie.secure = true;
}

app.use(helmet(), cookie(), session(sess), bodyParser.json());

if (result.error) throw result.error;
require(__dirname + "/product.js");
require(__dirname + "/orders.js");
require(__dirname + "/admin.js");
require(__dirname + "/config.js");

app.use(path.join(__dirname, "..", "build"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "build", "index.html"));
});

app.listen(5000, function() {
  console.log("Listening on port 5000!");
});
