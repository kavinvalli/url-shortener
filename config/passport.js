const passport = require("passport");
var GoogleStrategy = require('passport-google-oauth20').Strategy;

const allowedEmails = require("../data/allowedEmails");

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    function(accessToken, refreshToken, profile, done) {
          try {
            const email = profile.emails[0].value;
            if (allowedEmails.includes(email)) {
              const user = { email }
              return done(null, user, "Logged In");
                } else {
                  error = "You do not have access."
                  return done(error, null)
                }
          } catch (e) {
            done(e);
          }
    }
  )
)

passport.serializeUser(function(user, done) {
  console.log(`Serializing User: ${user.email}`)
  done(null, user.email);
});

passport.deserializeUser(function(email, done) {
  console.log("Here we are://///");
  if (allowedEmails.includes(email)) {
    const user = { email }
    console.log(`Deserializing User: ${user.toString()}`)
    return done(null, user);
  } else {
    error = new Error("You do not have admin access.")
    error.statusCode = 400;
    return done(error, null)
  }
});
