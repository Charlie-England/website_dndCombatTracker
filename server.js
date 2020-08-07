const express = require("express");

let app = express();
app.use(express.static("public"));

app.get("/", function(req, res) {
    req.sendFile(__dirname+"/public/index.html");
})

app.listen(3000, function() {
    console.log("Server running on port 3000.");
})