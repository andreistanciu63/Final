var express = require("express");
var router = express.Router();

router.get("/", async function(req, res, next) {
  try {
    if (req.session.login) {
      const result = await req.ticketModel.find({ username: req.session.login }, "-_id").exec();
      res.render("history", {
        ticketsArray: result,
        username: req.session.login,
        title: "History | PreBook"
      });
    } else {
      res.render("catcherror", {
        errorMessage: "Sorry, you are not logged in.",
        redirectUrl: "/"
      });
    }
  } catch (err) {
    console.log("DB Error", err);
    res.render("catcherror", {
      errorMessage: "Sorry, there was an error retrieving your ticket history.",
      redirectUrl: "/"
    });
  }
});

router.post("/details", async function(req, res, next) {
  try {
    const currentBroadcast = await req.broadcastModel.findOne({ _id: req.body.broadcastId }).exec();
    const currentFilm = await req.filmModel.findOne({ filmName: currentBroadcast.filmName }).exec();
    res.send({
      filmName: currentFilm.filmName,
      houseName: currentBroadcast.houseName,
      category: currentFilm.category,
      showTime:
        currentBroadcast.date +
        " " +
        currentBroadcast.time +
        " (" +
        currentBroadcast.day +
        ")",
      seatNo: req.body.seatRow + req.body.seatCol,
      ticketFee: req.body.ticketFee
    });
  } catch (err) {
    console.log("DB Error", err);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
