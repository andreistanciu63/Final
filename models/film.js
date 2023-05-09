const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const filmSchema = new mongoose.Schema({
  id: String,
  filmName: String,
  description: String,
  director: String,
  category: String,
  language: String,
  poster: String
});

module.exports = mongoose.model("film", filmSchema);