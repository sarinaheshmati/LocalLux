var Apartment = require("../models/apartment"),
    User = require("../models/user"),
    Review = require("../models/review"),
    Message = require("../models/message");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login first.");
    res.redirect("/login");
};

middlewareObj.checkApartmentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Apartment.findById(req.params.id, function(err, foundApartment){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            }else if(!foundApartment){
                req.flash("error", "Place not found");
                res.redirect("back");
            }else{
                if(foundApartment.host._id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "You don't have host permissions.");
                    res.redirect("back");
                }
            }
        }); 
    }else{
        req.flash("error", "Please login first.");
        res.redirect("/login");
    }   
};

middlewareObj.isHost = function(req, res, next){
    if(req.isAuthenticated()){
        User.findById(req.params.id, function(err, user){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            }else if(!user){
                req.flash("error", "User not found");
                res.redirect("back");
            }else{
                if(user.app_role.includes("host")){
                    next();
                }else{
                    req.flash("error", "You don't have host permissions.");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "Please login first.");
        res.redirect("/login");
    }
};

middlewareObj.isAdmin = function(req, res, next){
    if(req.isAuthenticated()){
        User.findById(req.params.id, function(err, user){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            }else if(!user){
                req.flash("error", "User not found");
                res.redirect("back");
            }else{
                if(user.app_role[0] == "admin" && user.app_role.length == 1){
                    next();
                }else{
                    req.flash("error", "You don't have admin permissions.");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "Please login first.");
        res.redirect("/login");
    }
};

module.exports = middlewareObj;
