var express = require("express");
require("dotenv").config();
var path = require("path");

const aws = require("aws-sdk");
aws.config.region = "us-east-2";

// app.engine('html', require('ejs').renderFile);

const S3_BUCKET = process.env.S3_BUCKET;

var app = express();

var PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// require("./routes/apiRoutes")(app);
require("./app/routes/htmlRoutes.js")(app);
require("./app/routes/apiRoutes.js")(app);

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

app.post("/save-details", (req, res) => {
	console.log(req);
});

app.listen(PORT, function () {
	console.log("App listening on PORT: " + PORT);
});
