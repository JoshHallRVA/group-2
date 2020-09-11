var bodyParser = require("body-parser");
var express = require("express");
var path = require("path");
require("dotenv").config();



var app = express();

var PORT = process.env.PORT || 3030;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(express.static("./app/public/"));

// require("./routes/apiRoutes")(app);




require("./app/routes/apiRoutes")(app);
require("./app/routes/htmlRoutes")(app);

app.post("/save-details", (req, res) => {
	console.log(req);
});

app.listen(PORT, function () {
	console.log("App listening on PORT: " + PORT);
});


