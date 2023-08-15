export default class ProductFactory {
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

    async add(product){
        try {
            return await this.dao.addProduct(product);
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
}

export class UserFactory {
    constructor (dao) {
        this.dao = dao;
    }
    
    async get(){
        try {
            return await this.dao.getUsers();
        } catch (error) {
            console.log(error);
        } 
    }
    
    async add(user){
        try {
            return await this.dao.addProduct(product);
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
}

export class CartFactory {
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
}