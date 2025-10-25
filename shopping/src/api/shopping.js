import ShoppingService from "../services/shopping-service.js";
import { PublishCustomerEvent } from "../utils/index.js";
import UserAuth from './middlewares/auth.js';
import { SubscribeMessage ,PublishMessage} from "../utils/index.js";
import  config  from "../config/index.js"
const {SHOPPING_BINDING_KEY,CUSTOMER_BINDING_KEY,QUEUE_NAME}=config



export default (app,channel) => {
    
    const service = new ShoppingService();
    SubscribeMessage(channel,service)
   

    app.post('/order', UserAuth, async (req, res, next) => {
        const { _id } = req.user;
        const { txnNumber } = req.body;

        try {
            const { data } = await service.PlaceOrder({ _id, txnNumber });

            const payload=await service.GetOrderPayload(_id,data,'CREATE_ORDER')

            // PublishCustomerEvent(payload)
            PublishMessage(channel,CUSTOMER_BINDING_KEY,JSON.stringify(payload))


            return res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    });

    app.get('/orders', UserAuth, async (req, res, next) => {
        const { _id } = req.user;

        try {
            const { data } = await service.GetOrders(_id);
            return res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    });
       
    app.get('/cart', UserAuth, async (req, res, next) => {
        const { _id } = req.user;

        try {
            const { data } = await service.getCart({_id});
            return res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    });
};
