const express			= require("express"),
	  router			= express.Router(),
	  multer			= require("multer"),
	  middleware		= require("../middleware"),
	  cloudinary 		= require("cloudinary"),
	  User		 		= require("../models/user"),
	  apartment 		= require("../models/apartment"),
	  NodeGeocoder 		= require("node-geocoder"),
	  transliteration 	= require('transliteration'),
	  greekUtils 		= require('greek-utils'),
	  tr 				= require('transliteration').transliterate;

var options = {
	provider: 'opencage',
	httpAdapter: 'https',
	apiKey: "6b35a781fad343ddac3172ddaf206b45",
	formatter:null
};
	  

var geocoder = NodeGeocoder(options);

// MULTER CONFIGURATION
var upload = multer({ "dest": "../uploads/"});

// CLOUDINARY CONFIGURATION
cloudinary.config({
	cloud_name: "meryf",
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

// New Route for a host's apartment
router.get("/new", middleware.isLoggedIn, function(req,res){
	res.render("apartments/new");
});

// Create Route for a host's apartment
router.post("/", middleware.isLoggedIn, upload.array("images", 30)), async(req,res)=> {
	req.body.apartment["images"] = [];

	var	i=0;
	// For each uploaded image
	for(const file of req.files){
		var image = await cloudinary.v2.uploader.upload(file.path);
		// The firstly uploaded image should be the apartment's main image
		if(i == 0){
			req.body.apartment["main_image"] = {
				url: image.secure_url,
				public_id: image.public_id
			};
		}else{
			req.body.apartment.images.push({
				url: image.secure_url,
				public_id: image.public_id
			});
		}
	
		i += 1;
	}}

	
		// Check if the renting dates are valid
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();
		today = yyyy + '-' + mm + '-' + dd;