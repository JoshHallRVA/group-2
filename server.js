var bodyParser = require("body-parser");
var express = require("express");
var path = require("path");
require("dotenv").config();

var app = express();
var PORT = process.env.PORT || 8080;

var db = require("./models");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

require("./routes/post-api-routes.js")(app);
require("./routes/html-routes.js")(app);
require("./routes/author-api-routes.js")(app);

db.sequelize.sync({ force: false }).then(function () {
	app.listen(PORT, function () {
		console.log("App listening on PORT " + PORT);
	});
});
