var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var db = require("mongoose");
var session = require("express-session");


require('dotenv').config();

var userSchema = new db.Schema({
  username: String,
  password: String
});

var filmSchema = new db.Schema({
  id: String,
  filmName: String,
  description: String,
  director: String,
  category: String,
  language: String,
  poster: String
});

var commentSchema = new db.Schema({
  filmName: String,
  username: String,
  comment: String
});

var broadcastSchema = new db.Schema({
  id: String,
  date: String,
  time: String,
  filmName: String,
  houseName: String,
  day: String
});

var ticketSchema = new db.Schema({
  seatRow: String,
  seatCol: String,
  broadcastId: String,
  username: String,
  ticketType: String,
  ticketFee: String,
  filmId: String
});

var houseSchema = new db.Schema({
  houseName: String,
  houseRow: Number,
  houseCol: Number
});

var filmModel = db.model("film", filmSchema, "films");
var commentModel = db.model("comment", commentSchema, "comments");
var userModel = db.model("user", userSchema, "users");
var broadcastModel = db.model("broadcast", broadcastSchema, "broadcasts");
var ticketModel = db.model("ticket", ticketSchema, "tickets");
var houseModel = db.model("house", houseSchema, "houses");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var createRouter = require("./routes/create");
var commentRouter = require("./routes/comment");
var buyRouter = require("./routes/buy");
var historyRouter = require("./routes/history");
var pdfRoutes = require("./routes/pdfRoutes");
const { default: mongoose } = require("mongoose");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// TODO - Modify the sessionkey to something strong to prevent encryption breaks
app.use(session({
  secret: 'session-key',
  resave: false,  // Set resave option to false
  saveUninitialized: false, // Set saveUninitialized option to false
})); // Adding session middleware to the pipeline

app.use(function(req, res, next) {
  req.userModel = userModel;
  req.filmModel = filmModel;
  req.commentModel = commentModel;
  req.broadcastModel = broadcastModel;
  req.ticketModel = ticketModel;
  req.houseModel = houseModel;
  next();
});

app.use("/", indexRouter);
app.use("/createaccount", createRouter);
app.use("/users", usersRouter);
app.use("/comment", commentRouter);
app.use("/buy", buyRouter);
app.use("/history", historyRouter);
app.use("/pdf", pdfRoutes);

app.get("/main", function(req, res, next) {
  if (req.session.login)
    res.render("main", {
      title: "Home",
      username: req.session.login
    });
  else
    res.render("catcherror", {
      errorMessage: "sorry, you aren't logged in.",
      redirectUrl: "/"
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// db.connect('mongodb://0.0.0.0:27017/prebook', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
//   .then(() => {
//     console.log('MongoDB Connected...');
//   })
//   .catch(err => console.log(err));
const PORT = process.env.PORT || 3000;


db.set('strictQuery', false);
const connectDB = async () => {
  try {
    const conn = await db.connect(process.env.MONGO_URI)

  } catch (error) {
    console.log(error);
  }
}
connectDB().then(() => {
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
})

module.exports = app;
