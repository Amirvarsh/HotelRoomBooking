const mongoose = require("mongoose");
var mongoURL =
  "mongodb+srv://amirvarsh:varshking18@cluster0.ggepnrc.mongodb.net/mern-rooms";
mongoose.connect(mongoURL, { useUnifiedTopology: true, useNewURLParser: true });
var connection = mongoose.connection;
connection.on("error", () => {
  console.log("Mongo DB Connection failed");
});
connection.on("connected", () => {
  console.log("Mongo DB Connection Successful");
});
module.exports = mongoose;
