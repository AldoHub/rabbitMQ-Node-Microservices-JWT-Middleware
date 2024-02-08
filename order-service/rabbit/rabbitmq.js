const config = require("./../config/config.js")
const amqplib = require("amqplib");
const Order = require("./../models/Order.js");


class RabbitMq{
    channel;

    async connectRabbit(){
        const connection = await amqplib.connect(config.rabbitMQ.url).catch(err => console.log(err));
        if(connection){
          //instansiate a channel
          this.channel = await connection.createChannel();
          //create a channel called "ORDER"
          await this.channel.assertQueue("ORDER");
          console.log("----- CONNECTED TO RabbitMQ");
        }else{
          console.log("----- Error connecting to RabbitMQ");
        }

    }


    
    async createOrders(products, userEmail){
        let total = 0;
      
        for(let i=0; i < products.length; i++){
            total += products[i].price;
        }
        
        const newOrder = new Order({
            products,
            user: userEmail,
            total_price: total
        });
        
        newOrder.save();
        return newOrder;

    }
 

    async consumeMessages(from){
        if(!this.channel){
            await this.connectRabbit();
        }

        //consume the incoming messages to the ORDER queue
        this.channel.consume(from, async(data) => {

            console.log("consuming from queue: ", from);
            
            //get the message contents
            const { products, userEmail } = JSON.parse(data.content);
          

            //create the new order
            const newOrder = await this.createOrders(products, userEmail);
            

            //send a response back to the product service
            this.channel.sendToQueue("PRODUCT", Buffer.from(JSON.stringify(newOrder)));
            
        },{
            noAck: true
        })

    }



}

module.exports = RabbitMq;
