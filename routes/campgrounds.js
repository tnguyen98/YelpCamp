
var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
//defaults to using index.js in middleware
var middleware = require("../middleware");


//Index - Show all campgrounds
router.get("/", function(req, res){
	//Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else{
			res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user, page: 'campgrounds'});
		}
	});
});

//Create - Add new campground
router.post("/", middleware.isLoggedIn, function(req, res){
	//Grab name and body from form 
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var price = req.body.price;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, image: image, description: desc, author: author, price: price};
	
	//Create new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else{
			res.redirect("/campgrounds");
		}
	});
});

//New - Show form for new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//Show - Displays more information about one campground
router.get("/:id", function(req, res){
	//Find campground with provided ID and render show page
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else{
			//console.log(foundCampground);
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});


//Edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwner, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

//Update campground route
router.put("/:id", middleware.checkCampgroundOwner, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function( err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
	
});

//Delete route
router.delete("/:id", middleware.checkCampgroundOwner, async(req, res) => {
  try {
    let foundCampground = await Campground.findById(req.params.id);
    await foundCampground.deleteOne();
    res.redirect("/campgrounds");
  } catch (error) {
    console.log(error.message);
    res.redirect("/campgrounds");
  }
});

module.exports = router;