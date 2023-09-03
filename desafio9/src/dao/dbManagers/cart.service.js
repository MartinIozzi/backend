import cartModel from "../../../models/carts.model.js";
import { productService } from "./product.service.js";


class CartService {
    constructor() {
        this.model = cartModel;
    }

    async getCart(){
      const carts = await this.model.find();
      return carts;
    };

    async getCartId(cid){
      return cid;
    }

    async createCart(){
      try {
        const cartId = new mongoose.Types.ObjectId(); // Generar un nuevo ObjectId
        const createdCart = await this.model.create({ _id: cartId }); // Asignar el ObjectId al campo _id
        return createdCart._id.toString(); // Devolver el _id como una cadena de texto
      } catch (error) {
        console.log(error);
        throw error;
      }
    }

    async addCart(){
      try {
        const createdCart = await this.model.create({});
        return createdCart;
      } catch (error) {
        console.log(error);
      }
    };

    async getCartById (cid) {
      try {
        return await this.model.findById(cid).populate('products');
    } catch (err) {
      console.log(err);
    }
  }

  async addProdToCart(cartId, productId) {
    try {
      const cart = await this.model.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      const product = await productService.getProductByID(productId);
      if (!product) {
        throw new Error('Producto no encontrado');
      }
      const existingProduct = cart.products.find(
        (p) => p.product.toString() === productId.toString()
      );
      if (existingProduct) {
        existingProduct.quantity += 1; // Incrementar la cantidad si el producto ya existe
      } else {
        cart.products.push({ product: product._id, quantity: 1 }); // Agregar un nuevo producto con cantidad 1
      }
      return await cart.save();
    } catch (err) {
      throw err;
    }
  }

  async deleteProdFromCart(prodId, cartId){
  try{
    const cart = await this.model.findById(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }
    cart.products = cart.products.filter(
      (product) => product.product.toString() !== prodId
      );
      await cart.save();
      return cart;
    } catch (err) {
      console.log(err);
    }
  }

  async deleteAllProd(cartId){
  try{
    const cart = await this.model.findById(cartId);
    if (cart) {
      cart.products = [];
      await cart.save();
    } else{
      throw new Error('Carrito no encontrado');
    }
    
  } catch (err){
    console.log(err);
  }
}

async updateCart(cartId, products) {
try {
  const updatedCart = await this.model.findByIdAndUpdate(
    cartId,
    { products },
    { new: true }
    );
    return updatedCart;
  } catch (error) {
    console.log('Error: no se pudo actualizar los productos del carrito.');
  }
}

async updateProductQuantity(cartId, productId, quantity) {
  const cart = await this.model.findOne({ _id: cartId });
  const productIndex = cart.products.findIndex(
    (product) => product._id.toString() === productId
    );
    
    if (productIndex !== -1) {
      cart.products[productIndex].quantity = quantity;
      return await cart.save();
    } else {
      console.log('Error: el producto no fue encontrado dentro del carrito.');
    }
    }
}

export const cartService = new CartService();

