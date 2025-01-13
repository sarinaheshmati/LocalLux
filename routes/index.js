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