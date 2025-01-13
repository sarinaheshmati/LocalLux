const express	 = require("express"),
	  router	 = express.Router(),
	  User	  	 = require("../models/user"),
	  Apartment	 = require("../models/apartment"),
	  Message 	 = require("../models/message"),
	  middleware = require("../middleware"),
	  url		 = require("url");