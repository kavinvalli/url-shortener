const router = require("express").Router();
const auth = require("./auth");
const urls = require("./urls");
const Url = require("../models/Urls");

router.get("/", async (req, res) => {
	// res.send(`Welcome to my Kavin's link shortener ${req.isAuthenticated()}`);
  try {
		const urls = await Url.find();
		res.render("index", {
			error: null,
			isAuthenticated: req.isAuthenticated(),
			allUrls: urls,
		});
	} catch(err) {
		console.log(err);
		res.send(err);
	}
})

router.get("/:slug", (req, res) => {
	const slug = req.params.slug;
	Url.findOne({ slug }, async (err, result) => {
		if (err) {
			res.send(err);
		}
		if (result) {
			res.redirect(result.longUrl);
		} else {
			res.status(404).send("404 Not Found!");
		}
	})
})


router.use("/auth", auth);

router.use("/urls", urls);

module.exports = router;
