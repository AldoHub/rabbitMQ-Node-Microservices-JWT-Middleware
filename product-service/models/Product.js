const mongoose = require("mongoose");

//User model
const ProductSchema = mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId, 
    name: {type: String, required: true}, 
    description: {type: String, required: true}, 
    price: {type: Number, required: true},
    createdAt: {type: Date, default: Date.now()},  
});


//create and export the model
module.exports = mongoose.model("Product", ProductSchema);
