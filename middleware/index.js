var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};



middlewareObj.checkCampgroundOwner = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			req.flash("error", "Campground not found!");
			res.redirect("back");
		} else {
			//different types require equals
			if(foundCampground.author.id.equals(req.user._id)){
				next();
			} else {
				req.flash("error", "You do not have permission to do that!");
				res.redirect("back");
			}
		}
	})
	} else {
		req.flash("error", "Must be logged in first!")
		res.redirect("back");
	}
};

middlewareObj.checkCommentOwner = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		} else {
			//different types require equals
			if(foundComment.author.id.equals(req.user._id)){
				next();
			} else {
				req.flash("error", "You do not have permission to do that!");
				res.redirect("back");
			}
		}
	})
	} else {
		req.flash("error", "You do not have permission to do that!");
		res.redirect("back");
	}
};

middlewareObj.isLoggedIn = function(req, res, next){
	
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please login first!");
	res.redirect("/login");
	
}

module.exports = middlewareObj;