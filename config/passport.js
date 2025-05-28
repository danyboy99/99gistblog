const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const Admin = require("../model/admin");

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(async function (id, done) {
  const itsAdmin = await Admin.findById(id);

  return done(null, itsAdmin);
});

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      let errMsg = [];
      // check if the enter email exist
      const foundAdmin = await Admin.findOne({ email: email });

      if (!foundAdmin) {
        console.log("got here validate admin ");
        let message = "no admin with this email found";
        errMsg.push(message);
        done(null, false, req.flash("error", errMsg));
      }
      console.log("got here validate password");
      if (!foundAdmin.validatePassword(password)) {
        console.log(
          "got here what is boolean",
          foundAdmin.validatePassword(password)
        );
        let message = "wrong password !!";
        errMsg.push(message);
        return done(null, false, req.flash("error", errMsg));
      } else {
        return done(null, foundAdmin);
      }
    }
  )
);
