const User = require("../models/user.js");

module.exports.signup =  async(req,res) =>{
    try{
    let {username,email,password} = req.body;
    const newUser = new User({email,username});
    const registeredUser = await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err) =>{
        if(err) {
            return next(err);
        }
        req.flash("success","Welcome to StaySphere !");
        res.redirect("/listings");

    })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");

    }
    
}
module.exports.renderLoginForm = async(req,res) =>{
    res.render("user/login.ejs");
}

module.exports.login = async(req,res) =>{
    req.flash("success","welcome to back StaySphere!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
    // res.redirect(req.session.redirectUrl); // this will give problem when passport req.session will reset
    // res.redirect(res.locals.redirectUrl); // this will give issue in direct we will use login in website it will not get access to middleware isloggedin
}
module.exports.logout = (req,res) =>{
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");

    })
}
