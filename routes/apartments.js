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