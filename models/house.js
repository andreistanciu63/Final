const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const houseSchema = new mongoose.Schema({
  houseName: String,
  houseRow: Number,
  houseCol: Number
});

module.export = mongoose.model("house", houseSchema);