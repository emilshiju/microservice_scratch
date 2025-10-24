import express from "express"


const app=express()

app.use(express.json())


app.use((req,res)=>{

    return res.json({'msg':"Hello From Shopping"})
})

 

app.listen(8003,()=>{
    console.log("Shopping server is running in port 8000")
})