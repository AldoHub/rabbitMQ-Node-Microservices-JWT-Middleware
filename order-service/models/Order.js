const mongoose = require("mongoose");

//User model
const OrderSchema = mongoose.Schema({
    products: [
        {
            _id: {type: String, required: true}
        }
    ],
    user: {type: String, required: true},
    total_price: {type: Number, required: true},
    createdAt: {type: Date, default: Date.now()},  
   
});


//create and export the model
module.exports = mongoose.model("Order", OrderSchema);
