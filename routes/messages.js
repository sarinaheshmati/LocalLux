const express	 = require("express"),
	  router	 = express.Router(),
	  User	  	 = require("../models/user"),
	  Apartment	 = require("../models/apartment"),
	  Message 	 = require("../models/message"),
	  middleware = require("../middleware"),
	  url		 = require("url");

// Pagination for tenant
router.get("/tenant/page/:pageNum", function(req,res){

	var apartment = JSON.parse(req.query.str_apartment);
	var conversation = JSON.parse(req.query.str_conversation);
	
	var results_per_page = 10,
		start			 = (req.params.pageNum - 1) * results_per_page;
	
	var paginated = conversation.slice(start,start + results_per_page);

	res.render("messages/tenant/show", { conversation: paginated, all_messages: conversation,
										 apartment: apartment, host: apartment.host,
										 results_per_page: results_per_page, pageNum: req.params.pageNum,
										 num_days: req.query.num_days, check_in: req.query.check_in,
										 guests: req.query.guests, check_out: req.query.check_out });
});