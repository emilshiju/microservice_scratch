
import ShoppingService from "../services/shopping-service.js";

const ShoppingAppEvents=(app)=>{

    const service=new ShoppingService()

    app.use('/app-events',async(req,res,next)=>{

        const {payload}=req.body

        service.SubscribeEvents(payload)

        console.log("===================  Shopping Service recorded Event ============")
        
        return res.status(200).json(payload)

    })

}


export default ShoppingAppEvents