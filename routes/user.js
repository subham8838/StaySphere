const express = require("express");
const router = express.Router(); //router object
const User = require("../models/user.js");
const wrapAsync = require("../utils/WrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router
  .route("/signup")
  .get(
    async(req,res) =>{
    res.render("user/signup.ejs");
   })
   .post(wrapAsync( userController.signup));

router
  .route("/login")
  .get( userController.renderLoginForm)
  .post(saveRedirectUrl,passport.authenticate("local",{failureRedirect : '/login',failureFlash : true}),
   userController.login);

router.get("/logout", userController.logout);

// router.get("/signup",
//     async(req,res) =>{
//     res.render("user/signup.ejs");
// }
// )

//signup

// router.post("/signup",WrapAsync( userController.signup
// //     async(req,res) =>{
// //     try{
// //     let {username,email,password} = req.body;
// //     const newUser = new User({email,username});
// //     const registeredUser = await User.register(newUser,password);
// //     console.log(registeredUser);
// //     req.login(registeredUser,(err) =>{
// //         if(err) {
// //             return next(err);
// //         }
// //         req.flash("success","Welcome to StaySphere !");
// //         res.redirect("/listings");

// //     })
// //     // req.flash("success","Welcome to StaySphere !");
// //     // res.redirect("/listings");

// //     }catch(e){
// //         req.flash("error",e.message);
// //         res.redirect("/signup");

// //     }
    
// // }
// ));

//login

// router.get("/login", userController.renderLoginForm
// //     async(req,res) =>{
// //     res.render("user/login.ejs");
// // }
// )

// router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect : '/login',failureFlash : true}),
// userController.login
// // async(req,res) =>{
// //     req.flash("success","welcome to back StaySphere!");
// //     let redirectUrl = res.locals.redirectUrl || "/listings";
// //     res.redirect(redirectUrl);
// //     // res.redirect(req.session.redirectUrl); // this will give problem when passport req.session will reset
// //     // res.redirect(res.locals.redirectUrl); // this will give issue in direct we will use login in website it will not get access to middleware isloggedin
// // }
// );


// logout
// router.get("/logout", userController.logout
// //     (req,res) =>{
// //     req.logout((err) => {
// //         if(err) {
// //             return next(err);
// //         }
// //         req.flash("success","you are logged out!");
// //         res.redirect("/listings");

// //     })
// // }
// )

module.exports = router;

