var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
  res.render("create", { title: "Create a new account | PreBook" });
});

router.post("/create", async function(req, res, next) {
  try {
    const result = await req.userModel.findOne({ username: req.body.username });
    if (result) {
      res.render("catcherror", {
        errorMessage: "username already exists, choose another username.",
        redirectUrl: "/createaccount"
      });
    } else {
      const newUser = new req.userModel({
        username: req.body.username,
        password: req.body.password
      });
      await newUser.save();
      res.render("catchsuccess", {
        successMessage: "account created. Now please login.",
        redirectUrl: "/"
      });
    }
  } catch (err) {
    console.log("Database error: " + err);
    // handle the error
  }
});


module.exports = router;
