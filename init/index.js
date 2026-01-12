const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // load .env from project root

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
console.log("MAP_TOKEN:", process.env.MAP_TOKEN);

if (!mapToken) {
  throw new Error("MAP_TOKEN is not defined! Check your .env file and ensure it's in the project root.");
}
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

const MONGO_URL = 'mongodb://127.0.0.1:27017/wonderlust';
main().then(() =>{
    console.log("connected to db")
}).catch(err =>{
    console.log(err);
});

async function main() {
  await mongoose.connect(MONGO_URL);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const categories = [
  "trending","room","iconic","mountain","castle",
  "pool","camping","farm","arctic","dome","boat"
];

const randomCategory = () =>
  categories[Math.floor(Math.random() * categories.length)];

 


const initDB = async () => {
    await Listing.deleteMany({});

    const listingsWithExtras = await Promise.all(
        initData.data.map(async (obj) => {
            let geometry = { type: "Point", coordinates: [0, 0] };
            try{
                const geoResponse = await geocodingClient
                .forwardGeocode({
                query: obj.location,   // ✅ use obj.location
                limit: 1,
            })
            .send();
            const feature = geoResponse.body.features[0];

                if (feature && feature.geometry && feature.geometry.type === "Point" && Array.isArray(feature.geometry.coordinates)) {
                 geometry = {
                     type: "Point",
                     coordinates: [feature.geometry.coordinates[0],feature.geometry.coordinates[1]]
                 };
            }

            }catch (err) {
                 console.log(`Geocoding failed for ${obj.location}: ${err}`);
            }
        

      
        return {...obj,owner: "6942b5df36404e3b43df06c9",category: randomCategory(),geometry};
    }));
    await Listing.insertMany(listingsWithExtras);
    console.log("data was initialize");
}


initDB();