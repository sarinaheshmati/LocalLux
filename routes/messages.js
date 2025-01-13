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


// Show Route for tenant
router.get("/tenant/:tenant_id/:apartment", middleware.isTenant, function(req,res){
	User.findById(req.params.tenant_id).populate("messages.apartment")
	.populate({ path:"messages.conversation", populate: { path: "sender recipient" }})
	.exec(function(err, tenant){
		if(err){
			req.flash("error", err.message);
			return res.redirect("back");
		}

		Apartment.findById(req.params.apartment).populate("host").exec(function(err, apartment){
			if(err){
				req.flash("error", err.message);
				return res.redirect("back");
			}

			var conversation = [];
			for(var mail of tenant.messages){
				if(mail.apartment._id.equals(apartment._id)){
					conversation = mail.conversation.concat([]);
					break;
				}
			}

			var str_apartment = JSON.stringify(apartment);
			var str_conversation = JSON.stringify(conversation);

			res.redirect(url.format({
				pathname: "/messages/tenant/page/1",
				query: {
					"str_apartment": str_apartment,
					"str_conversation": str_conversation,
					"num_days": req.query.num_days,
					"check_in": req.query.check_in,
					"guests": req.query.guests,
					"check_out": req.query.check_out
				}
			}));
		});
	});
});

// Index Route for host
router.get("/host/:host_id/:id", middleware.checkApartmentOwnership, function(req,res){
	User.findById(req.params.host_id).populate("apartments").populate("messages.apartment")
	.populate({ path:"messages.conversation", populate: { path: "sender recipient" }})
	.exec(function(err, host){
		if(err){
			req.flash("error", err.message);
			return res.redirect("back");
		}

		var apartment = {};
		for(apartment of host.apartments){
			if(apartment._id.equals(req.params.id)){	
				break;
			}
		}

		if(Object.keys(apartment).length == 0){
			req.flash("error", "Could not find apartment.");
			return res.redirect("back");
		}

		var inbox = [];
		var sent = [];
		
		// console.log(host.messages);
		
		for(var mail of host.messages){
			if(mail.apartment._id.equals(apartment._id)){
				for(var message of mail.conversation){

					if(message.sender._id.equals(host._id)){
						sent.push(message);
					}else{
						inbox.push(message);
					}
				}
				break;
			}
		}

		var str_apartment = JSON.stringify(apartment);
		var str_inbox = JSON.stringify(inbox);
		var str_sent = JSON.stringify(sent);

		res.redirect(url.format({
			pathname: "/messages/host/pages/1/1",
			query: {
				"apartment": str_apartment,
				"inbox": str_inbox,
				"sent": str_sent
			}
		}));
	});
});