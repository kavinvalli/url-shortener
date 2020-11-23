module.exports = {
	authenticated: () => (req, res, next) => {
		if (res.locals.authenticated) {
			return next();
		}
		const err = new Error("Unauthorized");
		err.statusCode = 401;
		err.code = "401_UNAUTHORIZED";
		return next(err);
	},
	unauthenticated: () => (req, res, next) => {
		if (!res.locals.authenticated) {
			return next();
		}
		const err = new Error("Unauthorized");
		err.statusCode = 401;
		err.code = "401_UNAUTHORIZED";
		return next(err);
	},
}
