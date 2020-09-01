require("dotenv").config();
const morgan = require("morgan");
const express = require("express");
const app = express();

const PORT = process.env.PORT || 8080;

// Mongoose
const mongoose = require("mongoose");
mongoose.Promise = Promise;
const mongoUrl = process.env.MONGODB_URI;
mongoose.set("useCreateIndex", true);
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

//middleware
app.use(
    morgan(
      ":date[iso] :remote-addr :remote-user :method :status :url HTTP/:http-version :res[content-length] - :response-time ms",
      {
        skip: function(req, res) {
          return res.statusCode <= 200 || res.statusCode === 304;
        }
      }
    )
  );
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//routes
require("./routes/api-routes.js")(app);

app.get("/api/sso", function (req, res) {
res.json({CLIENTID:process.env.CLIENTID, ESI:process.env.ESI, CALLBACKURL:process.env.CALLBACKURL, STATE:process.env.STATE});
});
app.get("/api/authsso", (req, res) => {
  let key = Buffer.from(`${process.env.CLIENTID}:${process.env.SECRETKEY}`).toString('base64');
  console.log("key", key);
  res.json(key);
})

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
}

console.log("esi list: \n", encodeURI(process.env.ESI));

app.listen(PORT, () => {
    console.log(`🌎 ==> API server now on port ${PORT}!`);
});