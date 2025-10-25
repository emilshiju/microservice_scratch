
import ProductService from "../services/product-service.js";

const ProductAppEvents=(app)=>{

    const service=new ProductService()

    app.use('/app-events',async(req,res,next)=>{

        const {payload}=req.body

        service.SubscribeEvents(payload)

        console.log("===================  Shopping Service recorded Event ============")
        
        return res.status(200).json(payload)

    })

}


export default ProductAppEvents