var buyData = require("../data/buy-data.js");
var sellData = require("../data/sell-data.js");

module.exports = function (app) {
	app.get("/api/sell", function (req, res) {
		res.json(tableData);
	});
};
