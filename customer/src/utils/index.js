import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import  config  from "../config/index.js"

const { DB_URL, APP_SECRET ,MESSAGE_BROKER_URL,EXCHANGE_NAME,QUEUE_NAME,CUSTOMER_BINDING_KEY} = config;


// Utility functions
export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async (enteredPassword, savedPassword, salt) => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};

export const GenerateSignature = async (payload) => {
  try {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const ValidateSignature = async (req) => {
  try {
    const signature = req.get("Authorization");
    console.log(signature);
    const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
    req.user = payload;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const FormateData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};










//  Message Broker RabbitMQ



export const CreateChannel=async()=>{


  try{


    const connection=await amqplib.connect(MESSAGE_BROKER_URL)
    const channel=await connection.createChannel()

    await channel.assertExchange(EXCHANGE_NAME,'direct',false)

    return channel

  }catch(err){
    throw err
  }



}







export const SubscribeMessage=async(channel,service)=>{


  try{



    const appQueue=await channel.assertQueue(QUEUE_NAME)

    channel.bindQueue(appQueue.queue,EXCHANGE_NAME,CUSTOMER_BINDING_KEY)

    channel.consume(appQueue.queue,data=>{
      console.log('received data')
      console.log(data.connect.toString())
      channel.ack(data)
    })



  }catch(err){

  }

}


