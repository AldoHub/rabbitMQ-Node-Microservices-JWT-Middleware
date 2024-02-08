const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 9090;
const mongoose = require("mongoose");

const Rabbit = require('./rabbit/rabbitmq');
const rabbit = new Rabbit();




rabbit.connectRabbit().then(() => {
  //consume the messages and create an order
  //consume messages directed to the ORDER queue
  rabbit.consumeMessages("ORDER");

});


//database connection string
const database = require("./database/connection");

//mongo connect
mongoose.connect(
    database.connection, { useNewUrlParser: true })
  .then(connection => {
    console.log("ORDER SERVICE -- Connection established")
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

//routes
const userRoutes = require("./routes/routes");

app.use(express.json());

app.use("/", userRoutes);

app.listen(PORT, () => {
     console.log(`ORDER SERVICE -- listening on port ${PORT}`);   
})