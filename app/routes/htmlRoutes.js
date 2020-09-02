const path = require("path");

module.exports = function (app) {
	app.get("/", function (req, res) {
		res.sendFile(path.join(__dirname, "../public/index.html"));
	});
	app.get("/sneaks", function (req, res) {
		res.sendFile(path.join(__dirname, "../public/uploadSneaks.html"));
	});
	app.get("/forSale", function (req, res) {
		res.sendFile(path.join(__dirname, "../public/forSale.html"));
	});
	app.get("/assets", function (req, res) {
		res.sendFile(path.join(__dirname, "../public/assets.html"));
	});
	app.get("/resources", function (req, res) {
		res.sendFile(path.join(__dirname, "../public/resources.html"));
	});
};
