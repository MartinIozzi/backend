import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    img: {
        type: String
    }
})

productSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model('products', productSchema);