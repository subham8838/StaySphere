const express = require("express");
const router = express.Router(); //router object
const wrapAsync = require("../utils/WrapAsync.js");
// const expressError = require("../utils/ExpressError.js");
// const {listingSchema } = require("../schema.js"); // joi
const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner , validateListing} =require("../middleware.js");
const listingController = require("../controllers/listings.js");
// uploading file
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


// function for middleware validation for schema joi
// we are add this code in middleware.js
// const validateListing = ((req,res,next) =>{
//     let {error} = listingSchema.validate(req.body);
//     if(error){
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new expressError(400,errMsg);
//     }else{
//         next();
//     }
// })

// by the use of router.route() we can write common route path in same route to avoid duplication


router.get("/privacy",listingController.privacy);
router.get("/terms",listingController.terms);

router.get("/search",wrapAsync( listingController.search)); // search route

router.get("/new",isLoggedIn,listingController.renderNewForm); // new route (we have to write above id)


router
  .route("/")
  .get( wrapAsync( listingController.index)) //index route
  .post(validateListing,isLoggedIn,upload.single('listing[image]'),wrapAsync(listingController.createListing)); //create route
  

 
router
  .route("/:id")
  .get(wrapAsync( listingController.showListing)) // show route
  .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync( listingController.updateListing))// update route
  .delete(isLoggedIn,isOwner,wrapAsync( listingController.deleteListing)); // delete route



router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync( listingController.editListing)); // edit route







// serach route

// router.get("/search",async ( req,res) =>{
//   let searchQuery = req.query.q;

//   let listings = await Listing.find({
//     $or : [
//       { title:{$regex : searchQuery,$options: "i"}},
//       { location:{$regex : searchQuery,$options: "i"}},
//       { country:{$regex : searchQuery,$options: "i"}},
      
//     ]

//   });
//   res.render("listings/index.ejs", { listings });

// })





// index route 
// router.get("/", wrapAsync( listingController.index
    // we have make controllers their all code is their
//     async(req,res) =>{
//     const allListings = await Listing.find({}) // db.find()
//     res.render("listings/index.ejs",{allListings})
// }
// ));

// new route
// router.get("/new",isLoggedIn,listingController.renderNewForm
// //     async(req,res) =>{
// //     console.log(req.user);
// //     // first approach and second approach add middleware
// //     // if(!req.isAuthenticated()){
// //     //     req.flash("error","you must be logged in to create listing!");
// //     //     return res.redirect("/login");
// //     // }
// //     res.render("listings/new.ejs");
// // }
// );

// show route
// router.get("/:id",wrapAsync( listingController.showListing
// //     async(req,res,next) =>{
// //     let {id} = req.params;
// //     const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
// //     if(!listing){
// //         req.flash("error","Listing you requested for does not exist!");
// //         return res.redirect("/listings");
// //     }
// //     res.render("listings/show.ejs",{listing});

// // }
// ));

// create route
// router.post("/",validateListing,isLoggedIn,wrapAsync( listingController.createListing
// //     async(req,res) =>{
// //     let newListing = new Listing(req.body.listing); 
// //     newListing.owner = req.user._id;
// //     await newListing.save();
// //     req.flash("success","New Listing Created !");
// //     res.redirect("/listings")

// // }
// ));

// Edit route

// router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync( listingController.editListing
// //     async (req,res) =>{
// //     let {id} = req.params;
// //     const listing = await Listing.findById(id);
// //     if(!listing){
// //         req.flash("error","Listing you requested for does not exist!");
// //         return res.redirect("/listings");
// //     }
    
// //     res.render("listings/edit.ejs",{listing});   
// // }
// ));

// update route
// router.put("/:id",validateListing,isLoggedIn,isOwner,wrapAsync( listingController.updateListing
// //     async (req,res) =>{
// //     if(!req.body.listing){ // if the listing body is not there 
// //         throw new expressError(400,"send valid data for listing")  // 400 = bad request
// //     }
// //     let {id} = req.params;
// //     // we will add as middleware
// //     // let listing = await Listing.findById(id);
// //     // if(!listing.owner.equals(res.locals.currUser._id)){
// //     //     req.flash("error","you donot have permission");
// //     //     return res.redirect(`/listings/${id}`);
// //     // }
// //     await Listing.findByIdAndUpdate(id,{...req.body.listing});
// //     req.flash("success","New Listing Updated !");
// //     res.redirect(`/listings/${id}`);
// // }
// ));

// delete route
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync( listingController.deleteListing
// //     async (req,res) =>{
// //     let {id} = req.params;
// //     let deletedlisting = await Listing.findByIdAndDelete(id);
// //     console.log(deletedlisting);
// //     req.flash("success","Listing Deleted !");
// //     res.redirect("/listings");
// // }
// ));

module.exports = router;