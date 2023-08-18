import { ProductDTO } from "../dao/dto/dto.js";

export default class ProductRepository {
    constructor (dao) {
        this.dao = dao;
    }

    async get(){
        try {
            return await this.dao.getProducts();
        } catch (error) {
            console.log(error);
        } 
    }

    async getById(pid){
        try {
            return await this.dao.getProductByID(pid);
        } catch (error) {
            console.log(error);
        }
    }

    async add(product){
        try {
            const newProduct = new ProductDTO(product)
            return await this.dao.addProduct(newProduct);
        } catch (error) {
            console.log(error);
        }
    }

    async update(id, product){
        try {
            return await this.dao.updateProduct(id, product);
        } catch (error) {
            console.log(error);
        }
    }

    async delete(id){
        try {
            return await this.dao.deleteProduct(id);
        } catch (error) {
            console.log(error);
        }
    }

    async find(limit, sort, query, page){
        try {
            return await this.dao.findWithPagination(limit, sort, query, page);
        } catch (error) {
            console.log(error);
        }
    }
}

export class UserRepository {
    constructor (dao) {
        this.dao = dao;
    }
    
    async get(){
        try {
            return await this.dao.getAll();
        } catch (error) {
            console.log(error);
        } 
    }

    async getById(id){
        try {
            return await this.dao.getById(id);
        } catch (error) {
            console.log(error);
        }
    }

    async getByCartId(cartId){
        try {
            return await this.dao.getByCartId(cartId)
        } catch (error) {
            console.log(error);
        }
    }
    
    async create(user){
        try {
            return await this.dao.createUser(user);
        } catch (error) {
            console.log(error);
        }
    }
}

export class CartRepository {
    constructor (dao) {
        this.dao = dao;
    }
    
    async get(){
        try {
            return await this.dao.getCart();
        } catch (error) {
            console.log(error);
        } 
    }

    async getById(cartId){
        try {
            return await this.dao.getCartById(cartId)
        } catch (error) {
            console.log(error);
        }
    }

    async create(){
        try {
            return await this.dao.createCart();
        } catch (error) {
            console.log(error);
        }
    }
    
    async add(cartId, productId){
        try {
            return await this.dao.addProdToCart(cartId, productId);
        } catch (error) {
            console.log(error);
        }
    }

    async update(id, product){
        try {
            return await this.dao.updateCart(id, product);
        } catch (error) {
            console.log(error);
        }
    }

    async delete(id){
        try {
            return await this.dao.deleteAllProd(id);
        } catch (error) {
            console.log(error);
        }
    }
    //----------------------------//
    async updateProdQuan(cartId, productId, quantity){
        try {
            return await this.dao.updateProductQuantity(cartId, productId, quantity);
        } catch (error) {
            console.log(error);
        }
    }

    async deleteProd(prodId, cartId){
        try {
            return await this.dao.deleteProdFromCart(prodId, cartId)
        } catch (error) {
            throw error
        }
    }

    async deletePurchasedProducts(cartId, incompletedProducts) {
        try {
            return await this.dao.deletePurchasedProducts(cartId, incompletedProducts);
        } catch (error) {
            throw error
        }
    }
}