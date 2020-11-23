const mongoose = require("mongoose");

const UrlSchema = mongoose.Schema({
	longUrl: {
		type: String,
		required: true
	},
	slug: {
		type: String,
		required: true
	},
	shortUrl: {
		type: String,
		required: true
	}
})
module.exports = mongoose.model('Url', UrlSchema);
