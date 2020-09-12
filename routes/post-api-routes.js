var db = require("../models");

const aws = require("aws-sdk");
aws.config.region = "us-east-2";

const S3_BUCKET = process.env.S3_BUCKET;

module.exports = function (app) {
	app.get("/api/posts", function (req, res) {
		var query = {};
		if (req.query.author_id) {
			query.AuthorId = req.query.author_id;
		}

		db.Post.findAll({}).then(function (dbPost) {
			res.json(dbPost);
		});
	});

	app.get("/api/posts/:id", function (req, res) {
		db.Post.findOne({
			where: {
				id: req.params.id,
			},
			include: [db.Author],
		}).then(function (dbPost) {
			res.json(dbPost);
		});
	});

	app.post("/api/posts", function (req, res) {
		db.Post.create(req.body).then(function (dbPost) {
			res.json(dbPost);
		});
	});

	app.delete("/api/posts/:id", function (req, res) {
		db.Post.destroy({
			where: {
				id: req.params.id,
			},
		}).then(function (dbPost) {
			res.json(dbPost);
		});
	});

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
