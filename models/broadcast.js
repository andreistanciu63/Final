const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const broadcastSchema = new mongoose.Schema({
  id: String,
  date: String,
  time: String,
  filmName: String,
  houseName: String,
  day: String
});

module.exports = mongoose.model("broadcast", broadcastSchema);
