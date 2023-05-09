const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
  filmName: String,
  username: String,
  comment: String
});

module.exports = mongoose.model("comment", commentSchema);