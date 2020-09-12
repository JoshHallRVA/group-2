// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

const aws = require("aws-sdk");
aws.config.region = "us-east-2";

const S3_BUCKET = process.env.S3_BUCKET;

// Routes
// =============================================================
module.exports = function (app) {
	// GET route for getting all of the posts
	app.get("/api/posts", function (req, res) {
		var query = {};
		if (req.query.author_id) {
			query.AuthorId = req.query.author_id;
		}
		// Here we add an "include" property to our options in our findAll query
		// We set the value to an array of the models we want to include in a left outer join
		// In this case, just db.Author
		db.Post.findAll({
			// where: query,
			// include: [db.Author],
		}).then(function (dbPost) {
			res.json(dbPost);
		});
	});

	// Get route for retrieving a single post
	app.get("/api/posts/:id", function (req, res) {
		// Here we add an "include" property to our options in our findOne query
		// We set the value to an array of the models we want to include in a left outer join
		// In this case, just db.Author
		db.Post.findOne({
			where: {
				id: req.params.id,
			},
			include: [db.Author],
		}).then(function (dbPost) {
			res.json(dbPost);
		});
	});

	// POST route for saving a new post
	app.post("/api/posts", function (req, res) {
		db.Post.create(req.body).then(function (dbPost) {
			res.json(dbPost);
		});
	});

	// DELETE route for deleting posts
	app.delete("/api/posts/:id", function (req, res) {
		db.Post.destroy({
			where: {
				id: req.params.id,
			},
		}).then(function (dbPost) {
			res.json(dbPost);
		});
	});

	// PUT route for updating posts
	app.put("/api/posts", function (req, res) {
		db.Post.update(req.body, {
			where: {
				id: req.body.id,
			},
		}).then(function (dbPost) {
			res.json(dbPost);
		});
	});
 
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
	 

};
