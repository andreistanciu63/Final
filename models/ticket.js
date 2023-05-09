const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ticketSchema = new mongoose.Schema({
  seatRow: String,
  seatCol: String,
  broadcastId: String,
  username: String,
  ticketType: String,
  ticketFee: String
});

module.exports = mongoose.model("ticket", ticketSchema);