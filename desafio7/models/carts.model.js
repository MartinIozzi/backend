import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products'
        },
        quantity: {
          type: Number,
          default: 1,
        },
        _id: mongoose.Schema.Types.ObjectId,
      }
    ]
  });

const cartModel = mongoose.model('carts', cartSchema)

export default cartModel;