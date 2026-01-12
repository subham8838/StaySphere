const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

// passport-local-mongoose is automatically define username and password with hash and salt field

const userSchema = new Schema({
    email : {
        type : String,
        required:true
    }
});

userSchema.plugin(passportLocalMongoose); // automatically build username and password

module.exports = mongoose.model('User',userSchema);