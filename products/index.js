import express from "express"


const app=express()

app.use(express.json())


app.use((req,res)=>{

    return res.json({'msg':"Hello From Products"})
})



app.listen(8002,()=>{
    console.log("products server is running in port 8000")
})