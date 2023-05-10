var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
  if (req.session.login) {
    req.filmModel.find().then(resultOfFilm => {
      req.broadcastModel.find().then(resultofBroadcast => {
        console.log(resultofBroadcast);
        res.render("buyHome", {
          title: "Cumpara un bilet",
          filmArray: resultOfFilm,
          broadcastArray: resultofBroadcast
        });
      }).catch(err => {
        console.error("Error fetching broadcast data: ", err);
        res.render("catcherror", {
          errorMessage: "Error fetching broadcast data.",
          redirectUrl: "/"
        });
      });
    }).catch(err => {
      console.error("Error fetching film data: ", err);
      res.render("catcherror", {
        errorMessage: "Error fetching film data.",
        redirectUrl: "/"
      });
    });
  } else {
    res.render("catcherror", {
      errorMessage: "sorry, you aren't logged in.",
      redirectUrl: "/"
    });
  }
});



router.post("/seatplantry", async function(req, res, next) {
  // req.body.filmId & req.body.broadcastId are passed
  // need to pass the information regarding -> film, house, broadcast
  if (req.session.login) {
    try {
      const currentFilm = await req.filmModel.findOne({ _id: req.body.filmId });
      const currentBroadcast = await req.broadcastModel.findOne({ _id: req.body.broadcastId });
      const currentHouse = await req.houseModel.findOne({ houseName: currentBroadcast.houseName });
      const alreadyBoughtArray = await req.ticketModel.find({ broadcastId: req.body.broadcastId });
      const alreadyBoughtMap = alreadyBoughtArray.map(elem => elem.seatRow + "|" + elem.seatCol);
      console.log(alreadyBoughtMap);
      res.render("buyplantry", {
        title: "Alege un loc",
        currentFilm: currentFilm,
        currentBroadcast: currentBroadcast,
        currentHouse: currentHouse,
        alreadyBoughtMap: alreadyBoughtMap
      });
    } catch (err) {
      // error handling
      res.render("catcherror", {
        errorMessage: "An error occurred while fetching data.",
        redirectUrl: "/"
      });
    }
  } else {
    res.render("catcherror", {
      errorMessage: "Sorry, you aren't logged in.",
      redirectUrl: "/"
    });
  }
});


router.post("/buyticket", async function(req, res, next) {
  try {
    // req.body.filmId & req.body.broadcastId, req.body.seat (contains the seat numbers) are passed
    // need to pass the information regarding -> film, house, broadcast
    const isAlpha = function(ch) {
      return /^[A-Z]$/i.test(ch);
    };
    if (req.session.login) {
      const currentFilm = await req.filmModel.findOne({ _id: req.body.filmId });
      const currentBroadcast = await req.broadcastModel.findOne({ _id: req.body.broadcastId });
      if (isAlpha(req.body.seat[0])) req.body.seat = [req.body.seat];
      res.render("buyticket", {
        title: "Confirma biletul",
        currentFilm: currentFilm,
        currentBroadcast: currentBroadcast,
        seats: req.body.seat
      });
    } else {
      res.render("catcherror", {
        errorMessage: "sorry, you aren't logged in.",
        redirectUrl: "/"
      });
    }
  } catch (err) {
    next(err);
  }
});

router.post("/confirm", async function(req, res, next) {
try {
// req.body.filmId & req.body.broadcastId, req.body.seat (contains the seat numbers) are passed
// need to pass the information regarding -> film, house, broadcast
var isAlpha = function(ch) {
return /^[A-Z]$/i.test(ch);
};
function isNumeric(n) {
return !isNaN(parseFloat(n)) && isFinite(n);
}
if (!req.session.login) {
throw new Error("Sorry, you aren't logged in.");
}
const currentFilm = await req.filmModel.findOne({ _id: req.body.filmId });
const currentBroadcast = await req.broadcastModel.findOne({
  _id: req.body.broadcastId
});

console.log(req.body);
if (isAlpha(req.body.seat[0])) req.body.seat = [req.body.seat];
if (isNumeric(req.body.type)) req.body.type = [req.body.type];

// write to db
const newTickets = [];
for (var i = 0; i < req.body.seat.length; i++) {
  var typeOfTicket;
  if (req.body.type[i] == "75") typeOfTicket = "normal";
  else typeOfTicket = "cheap";
  const newTicket = new req.ticketModel({
    seatRow: req.body.seat[i][0],
    seatCol: req.body.seat[i][2],
    broadcastId: req.body.broadcastId,
    username: req.session.login,
    ticketType: typeOfTicket,
    ticketFee: req.body.type[i]
  });
  await newTicket.save();
  newTickets.push(newTicket);
}

res.render("buyconfirm", {
  title: "Confirma",
  currentFilm: currentFilm,
  currentBroadcast: currentBroadcast,
  seats: req.body.seat,
  types: req.body.type
});
} catch (err) {
res.render("catcherror", {
errorMessage: err.message,
redirectUrl: "/"
});
}
});
module.exports = router;
