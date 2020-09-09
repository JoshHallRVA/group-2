// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
var express = require("express");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Requiring our models for syncing
var db = require("./models");

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static directory
app.use(express.static("public"));

// Routes
// =============================================================
require("./routes/html-routes.js")(app);
require("./routes/author-api-routes.js")(app);
require("./routes/post-api-routes.js")(app);

app.get("/sign-s3", (req, res) => {
	const s3 = new aws.S3();
	const fileName = req.query["file-name"];
	const fileType = req.query["file-type"];
	const s3Params = {
		Bucket: S3_BUCKET,
		Key: fileName,
		Expires: 60,
		ContentType: fileType,
		ACL: "public-read",
	};
	s3.getSignedUrl("putObject", s3Params, (err, data) => {
		if (err) {
			console.log(err);
			return res.end();
		}
		const returnData = {
			signedRequest: data,
			url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`,
		};
		res.write(JSON.stringify(returnData));
		res.end();
	});
});

// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync({ force: false }).then(function () {
	app.listen(PORT, function () {
		console.log("App listening on PORT " + PORT);
	});
});
