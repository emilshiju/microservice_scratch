import {
 
  OrderModel,
  CartModel,
} from "../models/index.js";
import { v4 as uuidv4 } from "uuid";
import {
  APIError,
  STATUS_CODES,
  BadRequestError,
} from "../../utils/app-errors.js";

// Dealing with database operations
class ShoppingRepository {
  // Get orders for a customer
  async Orders(customerId) {
    try {
      const orders = await OrderModel.find({ customerId });
      return orders;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Orders"
      );
    }
  }

  async Cart(customerId) {
    try {
      const cartItems = await CartModel.find({
        customerId: customerId,
      });

      if (cartItems) {
        return cartItems;
      }

      throw new Error("Data Not Found");
    } catch (err) {
      throw err;
    }
  }

  async AddCartItem(customerId, item, qty, isRemove) {
    try {
      const cart = await CartModel.findOne({ customerId: customerId });

      const { _id } = item;

      if (cart) {
        let cartItems = cart.items;

        let isExist = false;

        if (cartItems.length > 0) {
          cartItems.map((item) => {
            if (item.product._id.toString() === _id.toString()) {
              if (isRemove) {
                cartItems.splice(cartItems.indexOf(item), 1);
              } else {
                item.unit = qty;
              }
              isExist = true;
            }
          });
        }

        if (!isExist && !isRemove) {
          cartItems.push({ product: { ...item, unit: qty } });
        }

        cart.items = cartItems;
        return await cart.save()
      } else {
        return await CartModel.create({
          customerId,
          items: [{ product: { ...item }, unit: qty }],
        });
      }
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Customer"
      );
    }
  }

  // Create new order from customer's cart
  async CreateNewOrder(customerId, txnId) {
    try {
      const cart = await CartModel.findOne({customerId:customerId})

      if (cart) {
        let amount = 0;
        const cartItems = cart.items

        if (cartItems.length > 0) {
          // Calculate total amount
          cartItems.map((item) => {
            amount += parseInt(item.product.price) * parseInt(item.unit);
          });

          const orderId = uuidv4();

          const order = new OrderModel({
            orderId,
            customerId,
            amount,
            txnId,
            status: "received",
            items: cartItems,
          });

          cart.items = [];

          const orderResult = await order.save();

          await cart.save();

          return orderResult;
        }
      }

      return {};
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Process Order"
      );
    }
  }
}

export default ShoppingRepository;
