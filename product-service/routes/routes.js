const express = require("express");
const router = express.Router();

const Product = require("../models/Product");

const Rabbit = require('./../rabbit/rabbitmq');
const rabbit = new Rabbit();

//auth middleware
const isAuthenticated = require("../../isAuthenticated/index");

const jwt = require("jsonwebtoken");


//create a product
router.post("/product/create", isAuthenticated, async (req, res, next) => {
    //check the user details from the middleware return
    //create the new product
    const { name, description, price } = req.body;
    const newProduct = new Product({
        name, 
        description,
        price
    });
    
    newProduct.save();
    return res.json(newProduct);

});

//isAuthenticated
//buy a product
router.post("/product/buy", isAuthenticated, async (req, res, next) => {
    //receiving product ids
    const { ids } = req.body;
   
    //find the products
    const products = await Product.find({_id: {$in: ids }});

    //send a message to the ORDER queue with the products and user info
    await rabbit.publishMessages("ORDER", products, req);

    //consume the response from the order service
    await rabbit.consumeMessages("PRODUCT");
  
    console.log("-->", rabbit.order);
    return res.json(rabbit.order);
   
    
     
});



module.exports = router;