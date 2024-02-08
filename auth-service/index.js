const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 7070;
const mongoose = require("mongoose");

//database connection string
const database = require("./database/connection");

//routes
const userRoutes = require("./routes/routes");

//mongo connect
mongoose.connect(
    database.connection, { useNewUrlParser: true })
  .then(connection => {
    console.log("AUTH SERVICE -- Connection established")
  })
  .catch(error => {
    console.log(database);
    console.log({
        error : {
            name : error.name,
            message : error.message,
            errorCode: error.code,
            codeName: error.codeName
        }
    })
  });



app.use(express.json());

app.use("/", userRoutes);

app.listen(PORT, () => {
     console.log(`AUTH SERVICE -- listening on port ${PORT}`);   
})