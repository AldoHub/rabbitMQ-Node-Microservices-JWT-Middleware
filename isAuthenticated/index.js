const jwt = require("jsonwebtoken");

async function isAuthenticated(req, res, next){

    if(req.headers["authorization"]){
        const token = req.headers["authorization"].split(" ")[1]; //get the token string
        //verify the token
        jwt.verify(token, "secretstring", (err, user) =>{
            if(err){
                console.log(err);
            }else{
                req.user = user;
                next();
            }
        });
    }else{
        console.log("Header not found");
    }

   

}

module.exports = isAuthenticated; 