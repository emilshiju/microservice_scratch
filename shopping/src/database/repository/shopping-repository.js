import { CustomerModel, ProductModel, OrderModel } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';
import { APIError, STATUS_CODES, BadRequestError } from '../../utils/app-errors.js';

// Dealing with database operations
class ShoppingRepository {

  // Get orders for a customer
  async Orders(customerId) {
    try {
      const orders = await OrderModel.find({ customerId }).populate('items.product');
      return orders;
    } catch (err) {
      throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Orders');
    }
  }

  // Create new order from customer's cart
  async CreateNewOrder(customerId, txnId) {
    try {
      const profile = await CustomerModel.findById(customerId).populate('cart.product');

      if (profile) {
        let amount = 0;
        const cartItems = profile.cart;

        if (cartItems.length > 0) {
          // Calculate total amount
          cartItems.forEach(item => {
            amount += parseInt(item.product.price) * parseInt(item.unit);
          });

          const orderId = uuidv4();

          const order = new OrderModel({
            orderId,
            customerId,
            amount,
            txnId,
            status: 'received',
            items: cartItems
          });

          profile.cart = [];

          await order.populate('items.product').execPopulate();
          const orderResult = await order.save();

          profile.orders.push(orderResult);
          await profile.save();

          return orderResult;
        }
      }

      return {};
    } catch (err) {
      throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Process Order');
    }
  }
}

export default ShoppingRepository;
