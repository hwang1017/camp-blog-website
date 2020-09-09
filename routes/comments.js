var express = require("express");
var router = express.Router({mergeParams: true});
var CampGround = require("../models/campground");
var Comment    = require("../models/comment");
var middleware = require("../middleware");

//Comment New
router.get("/new", middleware.isLoggedIn, function(req, res){
	CampGround.findById(req.params.id, function(err, foundCampground){
		if (err || !foundCampground) {
			req.flash("error", "Campground not found...");
			res.redirect("/campground");
		} else {
			res.render("comments/new", {campground: foundCampground});
		}
	});
});

//Comment Create
router.post("/", middleware.isLoggedIn, function(req, res){
	CampGround.findById(req.params.id, function(err, foundCampground){
		if (err || !foundCampground) {
			req.flash("error", "Campground not found...");
			return res.redirect("/campground");
		}
		Comment.create(req.body.comment, function(err, comment){
			if (err) {
				res.redirect("/campground/" + foundCampground._id);
			} else {
				comment.author.id = req.user._id;
				comment.author.username = req.user.username;
				comment.save();
				foundCampground.comments.push(comment);
				foundCampground.save();
				req.flash("success", "Yeah!~ Your comment is just posted!");
				res.redirect("/campground/" + foundCampground._id);
			}
		});
	});
});

//Edit
router.get("/:comment_id/edit", middleware.isCommentAuthor, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
	})
});


//Update
router.put("/:comment_id", middleware.isCommentAuthor, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		req.flash("success", "Your comment is just updated!");
		res.redirect("/campground/" + req.params.id);
	});
});

//destroy 
router.delete("/:comment_id", middleware.isCommentAuthor, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		req.flash("success", "Your comment is just deleted!");
		res.redirect("/campground/" + req.params.id);
	});
});


module.exports = router;