var CampGround = require("../models/campground");
var Comment    = require("../models/comment");
var middlewareObj = {};


middlewareObj.isCampgroundAuthor = function(req, res, next) {
	if (req.isAuthenticated()) {
		CampGround.findById(req.params.id, function(err, foundCampground){
			if (err || !foundCampground) {
				req.flash("error", "Campground not found...");
				res.redirect("back");
			} else {
				if (foundCampground.author.id.equals(req.user._id)) return next();
				else {
					req.flash("error", "You don't have permission to do this!");
					res.redirect("/campground/" + req.params.id);
				}
			}
		});
	} else {
		req.flash("error", "Please Login First!");
		res.redirect("/login");
	}
};





middlewareObj.isCommentAuthor = function(req, res, next) {
	if (req.isAuthenticated()) {
		CampGround.findById(req.params.id, function(err, foundCampground){
			if (err || !foundCampground) {
				req.flash("error", "Campground not found...");
				return res.redirect("back");
			}
			Comment.findById(req.params.comment_id, function(err, foundComment){
				if (err || !foundComment) {
					req.flash("error", "Comment not found...");
					return res.redirect("back");
				} else {
					if (foundComment.author.id.equals(req.user._id)) return next();
					else {
						req.flash("error", "You don't have permission to do this!");
						res.redirect("/campground/" + req.params.id);
					}
				}
			});
		});
	} else {
		req.flash("error", "Please Login First!");
		res.redirect("/login");
	}
};

middlewareObj.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash("error", "Please Login First!");
	res.redirect("/login");
}

module.exports = middlewareObj;