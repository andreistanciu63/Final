var express = require("express");
var router = express.Router();

// Handles the routing for the login paths
router.get("/", function(req, res, next) {
  res.render("index", { title: "PreBook | Cheap, Reliable, Instant!" });
});

router.post("/verifyLogin", function(req, res, next) {
  req.userModel.findOne({ username: req.body.username, password: req.body.password })
    .then(result => {
      if (result) {
        req.session.login = req.body.username;
        res.redirect("/main");
      } else {
        res.render("catcherror", {
          errorMessage: "you got the wrong username or/and password.",
          redirectUrl: "/"
        });
      }
    })
    .catch(err => {
      console.error(err);
      res.render("catcherror", {
        errorMessage: "An error occurred while verifying your login.",
        redirectUrl: "/"
      });
    });
});


router.get("/logout", function(req, res, next) {
  req.session.destroy(err => {
    if (err) console.log("Cannot access session");
  });
  res.render("catchsuccess", {
    successMessage: "Logging you out.",
    redirectUrl: "/"
  });
});

module.exports = router;
