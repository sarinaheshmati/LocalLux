var express    = require("express"),
	router     = express.Router(),
	multer	   = require("multer"),
	cloudinary = require("cloudinary"),
	passport   = require("passport"),
	util	   = require("util"),
	User 	   = require("../models/user");

// MULTER CONFIGURATION
// Whenever a file gets uploaded we create a custom name for that file
// The name we are giving is gonna have the current time stamp + the original name of the file
var storage = multer.diskStorage({
	filename: function(req, file, callback){
		callback(null, Date.now() + file.originalname);
	}
});

var imageFilter = function(req, file, cb){
	// Accept image files only
	if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)){
		return cb(new Error("Only image files are allowed!"), false);
	}
	cb(null,true);
};
// We pass the configuration variables
var upload = multer({storage: storage, fileFilter: imageFilter});

// CLOUDINARY CONFIGURATION
cloudinary.config({
	cloud_name: "meryf",
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

// Welcome Page
router.get("/",function(req, res){
	res.render("landing");
});

// Show the register form
router.get("/register", function(req, res){
	res.render("register");
});


// Handle sing up logic
router.post("/register", upload.single("image"), function(req, res){
	req.body.user.picture = [];

	// If user has uploaded a profile picture
	if(req.file){
		cloudinary.uploader.upload(req.file.path, function(result){
			// We want to store the image's secure_url (https://)
			req.body.user["picture"] = {
				url: result.secure_url,
				public_id: result.public_id
			}

			req.body.user.username = req.body.username;
			req.body.user["messages"] = [];
			req.body.user["apartments"] = [];
			req.body.user["reviews"] = [];

			if(req.body.password != req.body.confirm_password){
				req.flash("error", "Password confirmation failed. Please try again.");
				res.redirect("/register");
			}else{
				req.body.user.password = req.body.password;
				User.register(req.body.user, req.body.password, function(err, user){
					if(err){
						req.flash("error", err.message);
						return res.redirect("/register");
					}

					passport.authenticate("local")(req, res, function(){
						req.flash("success", "Welcome to Airbnb " + user.username);
						if(user.app_role.includes("host")){
							req.flash("warning",
									  "The approval of your registration in Airbnb as a host is pending");
							return res.redirect("/users/" + req.user._id + "/host");
						}
						return res.redirect("/");
					})
				});
			}
		});
	}else{
		var	tempUser = new User({});
		// Use default profile picture
		req.body.user.picture = tempUser.picture;

		req.body.user.username = req.body.username;
		req.body.user["messages"] = [];
		req.body.user["apartments"] = [];
		req.body.user["reviews"] = [];

		if(req.body.password != req.body.confirm_password){
			req.flash("error", "Password confirmation failed. Please try again.");
			res.redirect("/register");
		}else{
			req.body.user.password = req.body.password;

			var temp = new User();
			req.body.user.approved_by_admin = temp.approved_by_admin;

			User.register(req.body.user, req.body.password, function(err, user){
				if(err){
					req.flash("error", err.message);
					return res.redirect("/register");
				}
				passport.authenticate("local")(req, res, function(){
					req.flash("success", "Welcome to Airbnb " + user.username);
					if(user.app_role.includes("host")){
						req.flash("warning",
								  "The approval of your registration in Airbnb as a host is pending");
						return res.redirect("/users/" + req.user._id + "/host");
					}
					res.redirect("/");
				})
			});
		}
	}
});