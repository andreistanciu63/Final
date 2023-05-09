const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    if (req.session.login) {
      const result = await req.filmModel.find().exec();
      res.render("comment", { title: "Leave a comment", filmArray: result });
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

router.get("/retrive/:name", async (req, res, next) => {
  try {
    const result = await req.commentModel.find({ filmName: req.params.name }).exec();
    let response = "";
    result.forEach((e) => {
      response += "<section style='padding: 1rem 3rem;'>";
      response += "<h3>Nume cont: " + e.username + "</h3>";
      response += "<p style='padding:0;'>" + e.comment + "</p>";
      response += "</section>";
    });
    res.send(response);
  } catch (err) {
    next(err);
  }
});

router.post("/submit", async (req, res, next) => {
  try {
    const newComment = new req.commentModel({
      filmName: req.body.FilmId,
      username: req.session.login,
      comment: req.body.comment,
    });
    await newComment.save();
    res.render("catchsuccess", {
      successMessage: "Comentariu adăugat.",
      redirectUrl: "/comment",
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
