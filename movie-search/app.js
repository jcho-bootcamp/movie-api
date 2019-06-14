const express = require("express"),
  app = express(),
  request = require("request"),
  favicon = require("serve-favicon"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  User = require("./models/user");

// PASSPORT CONFIG
app.use(require("express-session")({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("view engine", "ejs");
app.use(express.static("./public"));
app.use(favicon(__dirname + "/public/favicon.ico"));

mongoose.connect("mongodb://localhost/movie-central", { useNewUrlParser: true });

// INDEX ROUTE
app.get("/", (req, res) => {
  res.render("search");
});

// SHOW ROUTE
app.get("/results", (req, res) => {
  let query = req.query.search;
  let url = "http://www.omdbapi.com/?s=" + query + "&apikey=thewdb"

  request(url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      let searchData = JSON.parse(body);
      console.log(searchData);
      res.render("results", { searchData: searchData });
    } else {
      console.log(error);
    }
  });
});


app.listen(3000, () => console.log("Server is Listening on Port : 3000!"));