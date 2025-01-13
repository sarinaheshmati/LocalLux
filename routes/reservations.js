const	express	 	= require("express"),
	  	router	 	= express.Router(),
	  	middleware	= require("../middleware"),
	  	User		= require("../models/user"),
	  	Apartment	= require("../models/apartment"),
	  	url			= require("url");