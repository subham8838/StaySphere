// dotenv file for accessing
if(process.env.NODE_ENV != "production"){ // we cannot access in after deployment . in production level
    require('dotenv').config({quiet : true});
}

// console.log(process.env.CLOUD_NAME);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
// const Listing = require("./models/listing.js")
const path = require("path")
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate")
// const wrapAsync = require("./utils/WrapAsync.js"); // this code is their in routes folder where we link
// const expressError = require("./utils/ExpressError.js");
// const {listingSchema , reviewSchema} = require("./schema.js"); // joi
const Review = require("./models/review.js")
// express router
// listing.js require
const listingsRouter = require("./routes/listing.js");
// review.js require
const reviewsRouter = require("./routes/review.js");
// user.js require
const userRouter = require("./routes/user.js");


// session is use or interacting with client and server
const session = require("express-session");
// mongo session store (connect-mongo)
const MongoStore = require('connect-mongo').default;
// reflection the flash message
const flash = require("connect-flash");
// authentication
const passport = require("passport");
// strategy
const LocalStrategy = require("passport-local");
// require user model
const User = require("./models/user.js");

// for uploading image and file

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })



app.use(methodOverride("_method"));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true})); // parsing url data that will pass
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate); //all ejs template


// const MONGO_URL = 'mongodb://127.0.0.1:27017/wonderlust';
const dbUrl = process.env.ATLASDB_URL;
main().then(() =>{
    console.log("connected to db")
}).catch(err =>{
    console.log(err);
});

async function main() {
  await mongoose.connect(dbUrl);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

// mongo session store // MongoStore.create() this is a method to create new mongo

const store = MongoStore.create({
     mongoUrl:dbUrl,
     crypto : {
     secret: process.env.SESSION_SECRET,
     },
     touchAfter : 24*3600,  

});




const sessionOptions = {
    store,
    secret : process.env.SESSION_SECRET, // we are develpoment face that why use week 
    resave : false, // to prevent the deprecated warning that showing in  terminal
    saveUninitialized : true, // to prevent the deprecated warning that showing in  terminal
    cookie : { // in sessions we also see the expire of the cookies after 7 days 
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,

    }
}

store.on("error", (err) =>{
    console.log(" ERROR IN MONGO SESSION STORE " , err)
})


app.use(session(sessionOptions));
app.use(flash());

// using session in passport

app.use(passport.initialize()); //all single req passport will initialize
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
// use static authenticate method of model in LocalStrategy
passport.deserializeUser(User.deserializeUser());

// middleware for flash
app.use((req,res,next) =>{
    res.locals.success =  req.flash("success") || [];
    res.locals.error =  req.flash("error") || [];
    //console.log(res.locals.success);
    res.locals.currUser = req.user;
    next();
})

// // function for middleware validation for schema joi

// const validateListing = ((req,res,next) =>{
//     let {error} = listingSchema.validate(req.body);
//     if(error){
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new expressError(400,errMsg);
//     }else{
//         next();
//     }
// })

// const validateReview = ((req,res,next) =>{
//     let {error} = reviewSchema.validate(req.body);
//     if(error){
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new expressError(400,errMsg);
//     }else{
//         next();
//     }
// })




// this line only for knowledge we are separated all code in the route 

// app.get("/testlisting",async(req,res) =>{
//     let sampleListening = new Listing ({
//         title : " My new villa",
//         description : "by the beach",
//         price : 1200,
//         location : "goa",
//         country : "india"
//     })
//     await sampleListening.save();
//     console.log("sample was save");
//     res.send("sucessful testing")
    
// })

// we are use Express router for restructuring we can see the code clear for listing


// // index route 
// app.get("/listings",async(req,res) =>{
//     const allListings = await Listing.find({}) // db.find()
//     res.render("listings/index.ejs",{allListings})
// });
// // new route
// app.get("/listings/new",async(req,res) =>{
//     res.render("listings/new.ejs");

// });
// // show route

// app.get("/listings/:id",wrapAsync(async(req,res,next) =>{
//     let {id} = req.params;
//     const listing = await Listing.findById(id).populate("reviews");
//     res.render("listings/show.ejs",{listing});

// }));

// // create route
// app.post("/listings",validateListing,wrapAsync(async(req,res) =>{
//     // let {title,description,image,price,country,location} = req.body; // 1st way of writing abstracting all the variable
//     // if(!req.body.listing){ // if the listing body is not there 
//     //     throw new expressError(400,"send valid data for listing")  // 400 = bad request
//     // }

//     // for schema validation we use joi (we did not need to write any if condition)

//     // listingSchema.validate(req.body);
//     // console.log(result);
//     // if(result.error){
//     //     throw new expressError(400,result.error);
//     // }
//     let newListing = new Listing(req.body.listing); // it become instant  2nd way
//     // if(!newListing.title){ // this approach is difficult for doing this we have to make for all like price,location etc
//     //     throw new expressError(400,"title is missing")  // 400 = bad request
//     // }
//     await newListing.save();
//     res.redirect("/listings")

// }));

// // Edit route

// app.get("/listings/:id/edit",wrapAsync(async (req,res) =>{
//     let {id} = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs",{listing});   
// }));

// // update route
// app.put("/listings/:id",validateListing,wrapAsync(async (req,res) =>{
//     if(!req.body.listing){ // if the listing body is not there 
//         throw new expressError(400,"send valid data for listing")  // 400 = bad request
//     }
//     let {id} = req.params;
//     await Listing.findByIdAndUpdate(id,{...req.body.listing});
//     res.redirect(`/listings/${id}`);
// }));

// // delete route
// app.delete("/listings/:id",wrapAsync(async (req,res) =>{
//     let {id} = req.params;
//     let deletedlisting = await Listing.findByIdAndDelete(id);
//     console.log(deletedlisting);
//     res.redirect("/listings");
// }));

// // Reviews
// // post route and one to many relation
// app.post("/listings/:id/reviews", validateReview, wrapAsync(async(req,res) =>{
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);

//     listing.reviews.push(newReview);

//     await newReview.save();
//     await listing.save();

//     res.redirect(`/listings/${listing._id}`);
// }));

// // delete route 

// app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res) =>{
//     let {id ,reviewId } = req.params;
//     // remove in array using pull operator
//     await Listing.findByIdAndUpdate(id,{$pull: {review: reviewId}})
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/listings/${id}`);
// }))

// app.get("/",(req,res) => {
//     res.send("root is working");
// });

// demo user
// app.get("/demouser",async(req,res) =>{
//     let fakeUser = new User({
//         email : "student@gmail.com",
//         username : "subham"
//     });
//     let registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);

// })

// listings router we can use 
app.use("/listings", listingsRouter);

// review router we can use 
app.use("/listings/:id/reviews", reviewsRouter);

// user router we can use 
app.use("/", userRouter);

// 404 error handler
app.use((req,res,next) =>{
    next(new expressError(404,"page not found !"));
});

// error handler middleware

app.use((err,req,res,next) =>{
    // let {statusCode ,message} = err; in new version this not work

    // it handle the eroor but server will not stop
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong!";
    res.status(statusCode).render("error.ejs",{message})
    // res.status(statusCode).send(message);
});


app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});