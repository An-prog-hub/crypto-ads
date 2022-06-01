var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const fileUpload = require("express-fileupload");
var cors = require("cors");
var getDb = require("./orbitdb/orbit");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var ipfsRouter = require("./routes/ipfs");
const rateLimit = require("express-rate-limit");
const fs = require("fs");

require("./utils/heroku-ping");

const limiter = rateLimit({
	windowMs: 10000, // 10 seconds
	max: 10, // Limit each IP to 10 requests per `window` (here, per 10 seconds)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

getDb();

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());

// Apply the rate limiting middleware to all requests
app.use(limiter);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// enable files upload
app.use(
	fileUpload({
		createParentPath: true,
	})
);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/ipfs", ipfsRouter);

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
