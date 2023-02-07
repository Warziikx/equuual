const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const app = express();
const flash = require("express-flash");
const fs = require("fs");
const session = require("express-session");
const passport = require("passport");

let RedisStore = require("connect-redis")(session);

//Router
const wsRouter = require("./src/ws/v1/routers");
const webRouter = require("./src/web_app/routers");

const providersAuthRouter = require("./src/web_app/routers/providersAuthRouter");

// view engine setup
app.set("views", path.join(__dirname, "src/web_app/views"));
app.set("view engine", "pug");

if (process.env.NODE_ENV == "production") {
	rtg = require("url").parse(process.env.REDIS_URL);
	redis = require("redis").createClient(rtg.port, rtg.hostname);
	redis.auth(rtg.auth.split(":")[1]);
	app.use(
		session({
			store: new RedisStore({ client: redis }),
			secret: "DYrN9VijHO",
			resave: true,
			saveUninitialized: false,
		})
	);
} /*else {
	app.use(
		session({
			key: "utilisateur_sid",
			secret: "Im9^85aB&4cIzNhA",
			resave: false,
			saveUninitialized: false,
		})
	);
	app.use(
		logger("dev", {
			stream: fs.createWriteStream(path.join(__dirname, "logs/access.log"), {
				flags: "a",
			}),
		})
	);
}*/

//Ajoute de variable au locals
app.use(function (req, res, next) {
	res.locals.session = req.session;
	res.locals.request = req;
	next();
});

app.use(passport.initialize());

//Log
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());
app.use(express.static(path.join(__dirname, "public")));

//ROUTER
app.use("/api/v1", wsRouter);
app.use("/web/", webRouter);
app.use("/auth/", providersAuthRouter);

global.__basedir = __dirname;

/* -------------- */

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
