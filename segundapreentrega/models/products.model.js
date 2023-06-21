import mongoose from "mongoose";

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

export const productModel = mongoose.model('products', productSchema);