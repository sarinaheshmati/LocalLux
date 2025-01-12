const express = require("express"),
	mongoose = require("mongoose"),
	router = express.Router(),
	middleware = require("../middleware"),
	User = require("../models/user"),
	Apartment = require("../models/apartment"),
	Review = require("../models/review"),
	url = require("url");

// ----------------------------------------- REVIEWS FOR HOST  ----------------------------------------- //

// NEW Route for reviews about a host
router.get("/host/new", middleware.isLoggedIn, function(req, res){
	var host = JSON.parse(req.query.host);

	res.render("reviews/host/new", { host: host, apartment: req.query.apartment,
									 num_days: req.query.num_days,
									 check_in: req.query.check_in, guests: req.query.guests,
									 check_out: req.query.check_out });
});

// Create Route for reviews about a host
router.post("/host/:tenant_id/:host_id", middleware.isTenant, function(req,res){
	User.findById(req.params.tenant_id).populate("reviews").exec(function(err,tenant){
		if(err){
			req.flash("error", err.message);
			return res.redirect("back");
		}

		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0');
		var yyyy = today.getFullYear();
		today = dd + '-' + mm + '-' + yyyy;

		var review = {
			about: req.params.host_id.toString(),
			text: req.body.text,
			rating: req.body.rating,
			date: today,
			author: tenant._id
		};
	
		Review.create(review, function(err, newReview){
			if(err){
				req.flash("error", err.message);
				return res.redirect("back");
			}

			newReview.save();

			tenant.reviews.push(newReview);
			tenant.save();

			User.findById(req.params.host_id, function(err,host){
				if(err){
					req.flash("error", err.message);
					return res.redirect("back");
				}

				host.reviews.push(newReview);
				host.save();
			
				req.flash("success", "Your review was submitted successfully.");
				return res.redirect(url.format({
					pathname: "/reviews/host/" + host._id,
					query: {
						"apartment": req.query.apartment,
						"num_days": req.query.num_days,
						"check_in": req.query.check_in,
						"check_out": req.query.check_out,
						"guests": req.query.guests
					}
				}));
			});
		});
	});
});

module.exports = router;
