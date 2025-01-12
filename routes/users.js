const express = require("express"),
	router = express.Router(),
	multer = require("multer"),
	cloudinary = require("cloudinary"),
	User = require("../models/user"),
	Apartment = require("../models/apartment"),
	middleware = require("../middleware");

// MULTER CONFIGURATION
var storage = multer.diskStorage({
	filename: function (req, file, callback) {
		callback(null, Date.now() + file.originalname);
	},
});
var imageFilter = function (req, file, cb) {
	// Accept image files only
	if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
		return cb(new Error("Only image files are allowed!"), false);
	}
	cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter });

// CLOUDINARY CONFIGURATION
cloudinary.config({
	cloud_name: "meryf",
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Show route for host
router.get("/:id/host", middleware.isHost, function (req, res) {
	User.findById(req.params.id)
		.populate("apartments")
		.populate({ path: "reviews", populate: { path: "author" } })
		.exec(function (err, foundUser) {
			if (err) {
				req.flash("error", err.message);
				res.redirect("back");
			} else if (!foundUser) {
				req.flash("error", "User not found");
				res.redirect("back");
			} else {
				res.render("users/host", { host: foundUser, apartments: foundUser.apartments });
			}
		});
});

// Show route for admin
router.get("/:id/admin", middleware.isAdmin, function (req, res) {
	User.findById(req.params.id, function (err, foundUser) {
		if (err) {
			req.flash("error", err.message);
			res.redirect("back");
		} else if (!foundUser) {
			req.flash("error", "User not found");
			res.redirect("back");
		} else {
			Apartment.find({})
				.populate("reservations")
				.populate("reviews")
				.populate({ path: "host", populate: { path: "reviews" } })
				.exec(function (err, apartments) {
					if (err) {
						req.flash("error", err.message);
						return res.redirect("back");
					}

					res.render("users/admin/show", { apartments: apartments });
				});
		}
	});
});

// View users' info for admin
router.get("/:id/admin/users_list", middleware.isAdmin, function (req, res) {
	User.find({}).where({ app_role: { $ne: ["admin"] } }).exec(function (err, users) {
		if (err) {
			req.flash("error", err.message);
			return res.redirect("back");
		}

		res.render("users/admin/users_list", { users: users });
	});
});

// Admin will approve of a host's registration
router.post("/:id/admin/approve_host/:host_id", middleware.isAdmin, function (req, res) {
	User.findById(req.params.host_id, function (err, host) {
		if (err) {
			req.flash("error", err.message);
			return res.redirect("back");
		}

		host.approved_by_admin = "just approved";
		host.save();

		req.flash("success", host.username + "'s registration as a host was approved.");
		res.redirect("/users/" + req.params.id + "/admin/users_list");
	});
});

module.exports = router;
