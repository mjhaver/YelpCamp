var express         = require("express"),
    app             = express(),
    request         = require("request"),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");
    
//REQUIRING ROUTES    
var campgroundRoutes = require("./routes/campgrounds"),
    commentsRoutes = require("./routes/comments"),
    authRoutes = require("./routes/index");

//CONFIGURATION
mongoose.connect("mongodb://localhost/yelp_camp_v11");
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the DB

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "YelpCamp",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware for retrieving user details
//this middleware is called on every route.
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

//======================================
//  RESTFUL ROUTES USING EXPRESS ROUTER
//======================================
app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentsRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp Server Has Started!!");
});