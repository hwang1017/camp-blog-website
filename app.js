var express    = require("express");
var app        = express();

var parseurl = require('parseurl');
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);

var request    = require("request");
var bodyParser = require("body-parser");

var mongoose   = require("mongoose");
var flash      = require("connect-flash");

var passport   = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");

// Model template
var CampGround = require("./models/campground");
var Comment    = require("./models/comment");
var User       = require("./models/user");

// var seedDB     = require("./seeds");

//Routes
var commentRoutes    = require("./routes/comments"),
	campgroundRoutes = require("./routes/campground"),
	indexRoutes       = require("./routes/index")




//MongoDB Atlas OR LOCAL DB
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true);

const url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";

mongoose.connect(url, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false
}).then (() => {
	console.log("Connected to MongoDB!");
}).catch(err =>{
	console.log("Error", err.message);
});

//Local MongoDB
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true);
// mongoose.connect("mongodb://localhost:27017/yelp_camp");


// passeport configuration
app.use(session({
	secret: "Secret !!!!",
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({ mongooseConnection: mongoose.connection })
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Local MongoDB
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true);
// mongoose.connect("mongodb://localhost:27017/yelp_camp");



app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());



// Global variable
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/campground", campgroundRoutes);
app.use("/campground/:id/comments", commentRoutes);


// seedDB();

app.listen(process.env.PORT || 3000, process.env.IP, function(req, res){
	console.log("YelpCamp start!");
});