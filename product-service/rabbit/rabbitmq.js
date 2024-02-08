const config = require("./../config/config.js")
const amqplib = require("amqplib");

class RabbitMq{
    channel;
    order;

    async connectRabbit(){
        const connection = await amqplib.connect(config.rabbitMQ.url).catch(err => console.log(err));
        if(connection){
          //instansiate a channel
          this.channel = await connection.createChannel();
          //create a channel called "PRODUCTS"
          await this.channel.assertQueue("PRODUCT");
          console.log("----- CONNECTED TO RabbitMQ");
        }else{
          console.log("----- Error connecting to RabbitMQ");
        }

    }


    async publishMessages(to, products, req){
        if(!this.channel){
            await this.connectRabbit();
        }
     
        this.channel.sendToQueue(to, Buffer.from(JSON.stringify({
            products: products,
            userEmail: req.user.email
        })));
    }


    
    async consumeMessages(from){
        if(!this.channel){
            await this.connectRabbit();
        }

        try{
          
            this.channel.consume(from, (message) => {
                this.order = JSON.parse(message.content.toString())
                this.channel.ack(message);
                
            });
        } catch (error) {
            console.log("Error", error);
        } 
      
    }

}

module.exports = RabbitMq;
