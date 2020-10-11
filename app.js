var express    = require("express"),
	app        = express(),
	bodyParser = require("body-parser"),
	mongoose   = require("mongoose"),
	passport   = require("passport"),
	flash      = require("connect-flash"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	Campground = require("./models/campground"),
	Comment	   = require("./models/comment"),
	User	   = require("./models/user"),
	seedDB = require("./seeds");

//require routes
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds.js"),
	indexRoutes = require("./routes/index.js");

mongoose.connect("mongodb+srv://guest:guest@cluster0.xwobc.mongodb.net/yelpcamp?retryWrites=true&w=majority", {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

app.locals.moment = require("moment");
//Passport Config
app.use(require("express-session")({
	secret: "Lorem ipsum",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//provides currentUser to every route
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(3000, function(){
	console.log("YelpCamp server has started!");
});