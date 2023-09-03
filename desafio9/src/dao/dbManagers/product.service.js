import { productModel } from "../../../models/products.model.js";

class ProductService {
    constructor() {
        this.model = productModel;
    }
    async getProducts(){
        return await this.model.find().lean();
    };

    async addProduct(product) {
        try {
            return await this.model.create(product)
        } catch (e) {
            console.log("error de code", e);
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

    async updateProduct(products) {
        await this.model.update(products, {returnOriginal: false});
        save()
    }

    async deleteProduct(id) {
        await this.model.deleteOne({_id: id})
    }

    async find(query, limit) {
        return await this.model.find({type: query}).limit(limit)
    }
}

export const productService = new ProductService();