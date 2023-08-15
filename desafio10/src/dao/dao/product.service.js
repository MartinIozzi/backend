import {productModel} from '../../../models/products.model.js'
import mongoose from 'mongoose';

class ProductService {
    constructor() {
        this.model = productModel;
    }
    async getProducts(){
        try {
            return await this.model.find().lean();
        } catch (error) {
            console.log(error);
        }
        
    };

    async addProduct(product) {
        try {
            return await this.model.create(product)
        } catch (err) {
            console.log(err);
        }
    }
    
    async findWithPagination(limit, sort, query, page){
        try {
            const options = {lean: true, page, limit, sort};
            console.log(options);
            const prods = await this.model.paginate(query, options);
            console.log(prods);
            
            return prods;
        } catch (error) {
            console.log(error);
        }
    }

    async getProductByID(id) {
        return await this.model.findOne({ _id: id });
    }

    async updateProduct(id, data) {
        try {
            const objectId = mongoose.Types.ObjectId(id);
            let product = await this.model.findById(objectId);
        
            if(!product){
                throw new Error('Product not found');
            } 
    
            for (const key in data) {
                product[key] = data[key];
            }
    
            return await product.save();
        } catch (error) {
            console.log(error);
        }
    }

    async deleteProduct(id) {
        await this.model.deleteOne({_id: id})
    }

    async find(query, limit) {
        return await this.model.find({type: query}).limit(limit)
    }
}

export const productService = new ProductService();