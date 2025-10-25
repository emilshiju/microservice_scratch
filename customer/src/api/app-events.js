import CustomerService from "../services/customer-service.js";


const CustomerAppEvents=(app)=>{

    const service=new CustomerService()

    app.use('/app-events',async(req,res,next)=>{

        const {payload}=req.body

        service.SubscribeEvents(payload)

        console.log("===================  Customer Service recorded Event ============")
        
        return res.status(200).json(payload)

    })

}


export default CustomerAppEvents