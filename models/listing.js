const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { string } = require("joi");
const listingSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String
    },
    category: {
    type: String,
    enum: [
      "trending",
      "room",
      "iconic",
      "mountain",
      "castle",
      "pool",
      "camping",
      "farm",
      "arctic",
      "dome",
      "boat"
    ]
  },
    
    image : {
        url: String,
        filename : String
        // type : String,
        // default: 
        //     "https://images.unsplash.com/photo-1582719478191-708d33c0f79c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        // set : (v) => 
        //     v === "" 
        //          ? "https://images.unsplash.com/photo-1582719478191-708d33c0f79c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60" 
        //         : v , //this is use for default img and not added img
    },
    price : {
        type : Number
    },
    location : {
        type : String
    },
    country : {
        type : String
    },
    reviews : [{
        type : Schema.Types.ObjectId,
        ref : "Review"
    }],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    geometry : {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

// middleware for query deletion handling
listingSchema.post("findOneAndDelete",async(listing) =>{
    if(listing) {
          await Review.deleteMany({_id :{$in : listing.reviews}});
    }

});
const Listing = mongoose.model("listing",listingSchema);

module.exports = Listing;

