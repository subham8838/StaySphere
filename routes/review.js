const express = require("express");
const router = express.Router({mergeParams:true}); //router object
const wrapAsync = require("../utils/WrapAsync.js");
const expressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js"); // joi
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");



// validation schema for reviews
// we are adding this code in middleware.js
// const validateReview = ((req,res,next) =>{
//     let {error} = reviewSchema.validate(req.body);
//     if(error){
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new expressError(400,errMsg);
//     }else{
//         next();
//     }
// })
// Reviews
// post route and one to many relation
router.post("/", isLoggedIn,validateReview, wrapAsync( reviewController.createReview
//     async(req,res) =>{
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);
//     newReview.author = req.user._id;
//     console.log(newReview);
//     listing.reviews.push(newReview);

//     await newReview.save();
//     await listing.save();
//     req.flash("success","New Review Created !");

//     res.redirect(`/listings/${listing._id}`);
// }
));

// delete route 

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync( reviewController.deleteReview
//     async(req,res) =>{
//     let {id ,reviewId } = req.params;
//     // remove in array using pull operator
//     await Listing.findByIdAndUpdate(id,{$pull: {review : reviewId}})
//     await Review.findByIdAndDelete(reviewId);
//     req.flash("success","Review Deleted !");
//     res.redirect(`/listings/${id}`);
// }
));


module.exports = router;