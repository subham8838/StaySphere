const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const expressError = require("./utils/ExpressError.js");
const {listingSchema , reviewSchema} = require("./schema.js"); // joi

module.exports.isLoggedIn = (req,res,next) => {
    // console.log(req.user); if we see undefined means not logged in and if we see object means logged in
    // console.log(req.path,"..",req.originalUrl); we can see the originalUrl path 
    if(!req.isAuthenticated()){
        // originalurl save
        req.session.redirectUrl = req.originalUrl; // we have to send after login redirect to this url path
        req.flash("error","you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
}
// passport by default delete redirectUrl to solve that we have to use locals variable . we are using in middleware 

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

// to check current user is owner of listing (authorization)
module.exports.isOwner = async (req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","you are not Owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

// to check current user is owner of reviews (authorization)
module.exports.isReviewAuthor = async (req,res,next) => {
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not Owner of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = ((req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400,errMsg);
    }else{
        next();
    }
})

module.exports.validateReview = ((req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400,errMsg);
    }else{
        next();
    }
})