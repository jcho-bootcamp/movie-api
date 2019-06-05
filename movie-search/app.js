const express = require("express");
const app = express();
const request = require("request");

app.set("view engine", "ejs");
app.use(express.static("./public"));

app.get("/", (req, res) => {
  res.render("search");
});

app.get("/results", (req, res) => {
  // res.send("Hello! It works!");
  let query = req.query.search;
  let url = "http://www.omdbapi.com/?s=" + query + "&apikey=thewdb"

  request(url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      let searchData = JSON.parse(body);
      res.render("results", { searchData: searchData });
    } else {
      console.log(error);
    }
  });
});


app.listen(3000, () => console.log("Server is Listening on Port : 3000!"));