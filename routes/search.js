const express = require("express"),
	router = express.Router(),
	Apartment = require("../models/apartment"),
	url = require("url"),
	greekUtils = require("greek-utils"),
	tr = require("transliteration").transliterate;

// Search for apartments based on given location, dates, and number of guests
router.post("/", function (req, res) {
	var location = req.body.location,
		check_in = req.body.check_in,
		check_out = req.body.check_out,
		guests = req.body.guests,
		apartments = [];

	var zipcode = null,
		area = null,
		country = null,
		region = null;

	var str_array = location.split(/[ ,]+/),
		args = str_array.length;

	switch (args) {
		case 2:
			if (!isNaN(str_array[0])) {
				zipcode = str_array[0];
			} else {
				area = str_array[0];
			}

			country = str_array[1];
			break;
		case 3:
			if (!isNaN(str_array[0])) {
				zipcode = str_array[0];
				area = str_array[1];
			} else if (!isNaN(str_array[1])) {
				area = str_array[0];
				zipcode = str_array[1];
			} else {
				area = str_array[0];
				region = str_array[1];
			}

			country = str_array[2];
			break;

		case 4:
			if (!isNaN(str_array[0])) {
				zipcode = str_array[0];
				area = str_array[1];
			} else {
				zipcode = str_array[1];
				area = str_array[0];
			}

			region = str_array[2];
			country = str_array[3];
			break;
		default:
			req.flash("error", "Wrong location, please follow the given format.");
			return res.redirect("/");
	}

	var locationObj = {
		zipcode: zipcode,
		area: area ? tr(area) : area,
		region: region ? tr(region) : region,
		country: country ? tr(country) : country,
	};

	// To be implemented in the next commit: full search logic
});

module.exports = router;
