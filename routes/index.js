var express = require("express");
var router = express.Router();
var User       = require("../models/user");
var passport   = require("passport");
var LocalStrategy = require("passport-local");

//root route
router.get("/", function(req, res){
	res.render("landing")
});

//Authenticate
router.get("/register", function(req, res){
	res.render("register");
});

//sign up logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			req.flash("error", err.message);
			return res.redirect("register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Nice to meet you, " + user.username + "!");
			res.redirect("/campground");
		});
	});
});

// show login form
router.get("/login", function(req, res){
	res.render("login");
});

router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/campground", 
		failureRedirect: "/login"
	}), function(req, res){
});

//logout 
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "You've logged out!");
	res.redirect("/campground");
});

module.exports = router;