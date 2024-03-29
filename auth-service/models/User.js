const mongoose = require("mongoose");

//User model
const UserSchema = mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId, 
    name: {type: String, required: true}, 
    email: {type: String, required: true}, 
    password: {type: String, required: true},
    createdAt: {type: Date, default: Date.now()},  
});


//create and export the model
module.exports = mongoose.model("User", UserSchema);
