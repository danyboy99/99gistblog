const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const mongoStore = require("connect-mongo");
const adminRoutes = require("./router/admin");
const indexRoutes = require("./router/index");
const dotenv = require("dotenv");
const app = express();
dotenv.config();
//connect to data base with mongoose
let DB_url = process.env.DB_url;
mongoose
  .connect(DB_url)
  .then(() => console.log("connected to mongoDB"))
  .catch((err) => console.log(err.message));

// config ejs view engine
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// setup passport and session
require("./config/passport");
app.use(
  session({
    secret: "Danilosessionsecret",
    resave: true,
    saveUninitialized: true,
    store: mongoStore.create({
      mongoUrl: DB_url,
    }),
    cookie: { maxAge: 180 * 60 * 1000 },
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Make user available to all templates
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Routes
app.use("/", indexRoutes);
app.use("/admin", adminRoutes);

// 404 handler - must be before the error handler
app.use((req, res, next) => {
  res.status(404).render("404");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("500");
});

const port = process.env.PORT || 7000;

app.listen(port, () => {
  console.log(`app is running on port ${port} .`);
});
