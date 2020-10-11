
var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//root route
router.get("/", function(req, res){
	res.render("landing");
});


//Authentication Routes

//register form
router.get("/register", function(req, res){
	res.render("register", {page: 'register'});
});
//sign up logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp " + user.username);
			res.redirect("/campgrounds");
		});
	});
});

//Login Routes
//login form
router.get("/login", function(req, res){
	req.flash("error");
	res.render("login", {page: 'login'});
});
//login logic
router.post("/login", passport.authenticate("local", 
		{
			successRedirect: "/campgrounds", 
			failureRedirect: "/login",
			failureFlash: true
		}), function(req, res){
	 
});

//Logout Routes
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged out!");
	res.redirect("/campgrounds");
});

module.exports = router;