import express from "express"

import  database from "./database/index.js"
const {databaseConnection}=database
import expressApp from "./express-app.js"
import  config  from "./config/index.js"
import { CreateChannel } from "./utils/index.js"

const { DB_URL, APP_SECRET,PORT } = config;



const StartServer=async()=>{

    console.log("first")


    const app=express()

    await databaseConnection()


    const channel=await CreateChannel()



    console.log("second")


    await expressApp(app,channel)

    console.log("third")


    app.listen(PORT,()=>{
        console.log(`listening to port ${PORT}`);
    })
    .on('error', (err) => {
        console.log(err);
        process.exit();
    })

}

StartServer()