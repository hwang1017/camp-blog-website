var express = require("express");
var router = express.Router();
var CampGround = require("../models/campground");
var middleware = require("../middleware");


// root page
router.get("/", function(req, res){
	CampGround.find({}, function(err, allCampgrounds){
		if (err) {
			res.redirect("back");
		} else {
			res.render("campgrounds/index", {campground: allCampgrounds, currentUser: req.user});
		}
	});
});

// new form
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

// create new 
router.post("/", middleware.isLoggedIn, function(req, res){
	var name = req.body.name;
	var img = req.body.img;
	var price = req.body.price;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, img: img, price: price, description: description, author: author};
	
	CampGround.create(newCampground, function(err, newlyCreated){
		if (err) {
			req.flash("error", "Oops...Something went wrong...");
			res.redirect("/campground");
		} else {
			req.flash("success", "Wow!~ You just created a new campground!");
			res.redirect("/campground");
		}
	});
});

// show
router.get("/:id", function(req, res){
	CampGround.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if (err || !foundCampground) {
			req.flash("error", "Campground not found...");
			res.redirect("/campground");
		} else {
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

//Edit
router.get("/:id/edit", middleware.isCampgroundAuthor, function(req, res){
	CampGround.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	})
});


//Update
router.put("/:id", middleware.isCampgroundAuthor, function(req, res){
	CampGround.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		req.flash("success", "Your campground is just updated!");
		res.redirect("/campground/" + req.params.id);
	});
});

//destroy 
router.delete("/:id", middleware.isCampgroundAuthor, function(req, res){
	CampGround.findByIdAndRemove(req.params.id, function(err){
		req.flash("success", "Your campground is just deleted!");
		res.redirect("/campground");
	});
});


module.exports = router;