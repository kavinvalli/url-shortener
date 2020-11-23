const router = require("express").Router();
const passport = require("passport");
const {authenticated} = require("../lib/auth");


router.get(
	"/google",
	passport.authenticate("google", {
		scope: [
			"https://www.googleapis.com/auth/plus.login",
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile"
		]
	})
);

router.get(
	"/google/callback",
	passport.authenticate("google", {failureRedirect: "/login"}),
	async (req, res) => {
		console.log(req.isAuthenticated())
		console.log(req.user)
		console.log(req.session)
		res.redirect("/");
	}
);

router.get("/logout", (req, res) => {
	req.logout();
	req.session.destroy();
	res.render("/");
});

module.exports = router;
