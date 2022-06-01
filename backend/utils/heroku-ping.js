var https = require("https");

setInterval(function () {
	console.log("Health check");
	https.get(process.env.HEROKU_APP);
}, 300000); // every 5 minutes (300000)
