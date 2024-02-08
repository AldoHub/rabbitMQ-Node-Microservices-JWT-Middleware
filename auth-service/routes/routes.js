const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Mongoose = require("mongoose");

const jwt = require("jsonwebtoken");


//register
router.post("/auth/register", async (req, res, next) => {

    const {email, password, name} = req.body;
    
    //first check if the user exists based on the email
    const userExists = await User.findOne({email}).catch(err => {console.log(err)});

    if(userExists){
        return res.json({message: "User already exists"});
    }else{
        const newUser = new User({
            name,
            email,
            password // --- MUST BE HASHED FOR PROD
        });


        //save to db
        newUser.save();
        //return the new user data to the client
        return res.json(newUser);

    }


});


/*

"email": "testuser@test.com",
"password": "123456",


*/


//login
router.post("/auth/login", async(req, res, next) => {
    
    const {email, password} = req.body;

    //return the user if found
    const user = await User.findOne({email}).catch(err => console.log(err));

    if(!user){
        return res.json({message: "User doesnt exist"});
    }else{
        const payload = {
            email, 
            name: user.name
        }

        //TODO --- check password validity
        if(password !== user.password){
            return res.json({message: "Error with user"});
        }else{
            jwt.sign(payload, "secretstring", (err, token) => {
                if(err) {
                     console.log(err);
                }else{
                     return res.json({token: token});
                }
     
     
             })
        }

       
    }

    
});


module.exports = router;