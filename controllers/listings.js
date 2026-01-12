const { model } = require("mongoose");
const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

module.exports.search =async (req,res) =>{
  let searchQuery = req.query.q;
   if (!searchQuery || typeof searchQuery !== "string") {
        return res.redirect("/listings");
    }

    searchQuery = searchQuery.trim();

  let allListings = await Listing.find({
    $or : [
      { title:{$regex : searchQuery,$options: "i"}},
      { location:{$regex : searchQuery,$options: "i"}},
      { country:{$regex : searchQuery,$options: "i"}},  
    ]
  });
  res.render("listings/index.ejs", { allListings });
}


module.exports.index = async(req,res) =>{
    let allListings ;// db.find()
    let { category } = req.query; // filter base on category
     if (category) {
        allListings = await Listing.find({ category });
    } else {
        allListings = await Listing.find({});
    }
    res.render("listings/index.ejs",{allListings})
}

module.exports.renderNewForm = async(req,res) =>{
    res.render("listings/new.ejs");
}


module.exports.showListing = async(req,res,next) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});

}



module.exports.createListing = async(req,res) =>{
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit : 1, // tell one object come
        proximity: [-95.4431142, 33.6875431]
    })
    .send()

    const allowedCategories = [
        "trending","room","iconic","mountain","castle",
        "pool","camping","farm","arctic","dome","boat"
    ]; // to check the category is present in listing

    if (!allowedCategories.includes(req.body.listing.category)) {
        req.flash("error", "Invalid category selected");
        return res.redirect("/listings/new");
    }

    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body.listing); 
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.geometry = response.body.features[0].geometry; // mapbox
    let saveListing = await newListing.save();
    console.log(saveListing);
    req.flash("success","New Listing Created !");
    res.redirect("/listings")

}


module.exports.editListing = async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload","/upload/h_300,w_250"); // reduce the quality
    
    res.render("listings/edit.ejs",{listing, originalImageUrl});   
}


module.exports.updateListing = async (req,res) =>{
    if(!req.body.listing){ // if the listing body is not there 
        throw new expressError(400,"send valid data for listing")  // 400 = bad request
    }
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    
    req.flash("success","New Listing Updated !");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req,res) =>{
    let {id} = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("success","Listing Deleted !");
    res.redirect("/listings");
}

module.exports.privacy = async(req,res) =>{
    res.render("policies/privacy.ejs");
}

module.exports.terms = async(req,res) =>{
    res.render("policies/terms.ejs");
}