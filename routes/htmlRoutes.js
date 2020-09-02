const path = require("path");

module.exports = function(app){
    app.get("/", function(req, res) {
       
    
          res.sendFile(path.join(__dirname, "../public/index.html"));
        }
      );
      app.get("/sneaks", function(req, res) {
       
    
          res.sendFile(path.join(__dirname, "../public/uploadSneaks.html"));
        }
      );
}