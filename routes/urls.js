const router = require("express").Router();
const Url = require("../models/Urls");

router.get("/create", (req, res) => {
	if (req.isAuthenticated()) {
		res.render("create", {
			error: null,
			isAuthenticated: true,
			urlObject: null,
		})
	} else {
		res.send("Not Authenticated");
	}
})

router.post("/create", async (req, res) => {
	console.log("*******In Create Url API**********");
	// const { longUrl, slug } = req.body;
	console.log("*****");
	console.log(JSON.stringify(req.body));
	const longUrl = req.body.longUrl;
	const slug = req.body.slug;
	if (longUrl === "" || slug === "") {
		res.render("create", {
			isAuthenticated: true,
			urlObject: null,
			error: "Both fields are required",
			...req.body
		})
	}


	try {
		Url.findOne({ slug }, async (err, result) => {
			if (err) {
				console.log("**********err while find url with slug***********");
				res.render("create", {
					isAuthenticated: true,
					urlObject: null,
					error: err.toString(),
					...req.body
				})
			}
			if (!result) {
				const shortUrl = `${process.env.BASE_URL}/${slug}`;
				console.log("********short url generated*********");
				console.log(shortUrl);
				try {
					const newUrl = new Url({
						longUrl,
						slug,
						shortUrl
					});
					const savedUrl = await newUrl.save();
					res.redirect("/");
				} catch(err) {
					console.log("**********error wghile creating newUrl***********");
					res.render("create", {
						isAuthenticated: true,
						urlObject: null,
						error: err.toString(),
						...req.body
					});
				}
			} else {
				console.log("**********Slug exists***********");
				const err = "Slug already exists"
				res.render("create", {
					isAuthenticated: true,
					error: err.toString(),
					urlObject: result,
					...req.body
				});
			}
		})
	} catch(err) {
		console.log("in try catch wala error");
		res.render("create", {
			isAuthenticated: true,
			urlObject: null,
			error: err.toString(),
			...req.body
		});
	}
})

router.post("/delete", async(req, res) => {
	if (req.isAuthenticated()) {
		if (!req.body.urlId) {
			const message = "Url Id is required";
			const urls = await Url.find();
			res.render("index", {
				allUrls: urls,
				error: message
			})
		} else {
			const deletedUrl = await Url.remove({
				_id: req.body.urlId,
			});
			const urls = await Url.find();
			res.redirect("/");
		}
	} else {
		const message = "Authentication Error";
		const urls = await Url.find();
		res.render("index", {
			allUrls: urls,
			error: message
		})
	}
})

module.exports = router;
