const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const redis = require("redis");
const RedisStore = require("connect-redis")(session);
const path = require("path");
const bodyParser = require("body-parser");

const client = redis.createClient(process.env.REDIS_URL);
const app = express();

app.use(bodyParser.json())
	.use(bodyParser.urlencoded({
		extended: true
	}));

app.use(
	session({
		store: new RedisStore({client}),
		secret: process.env.SECRET || crypto.randomBytes(20).toString("hex"),
		cookie: {
			secure: process.env.NODE_ENV === "production",
			httpOnly: true,
		},
	})
);

require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

const routes = require("./routes");

// app.use(express.json());
app.use(cors());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));
app.use("/static", express.static("static"));

app.use("/", routes);

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
	.then(console.log("Connected to MongoDB"))
	.catch((err) => console.log(err));

module.exports = app;
