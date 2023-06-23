import { Router } from "express";
import ProductManager from "../services/productManager.js";

const viewsRouter = Router()
const productManager = new ProductManager()

viewsRouter.get ('/', async (req, res) => {
    let productsList = await productManager.getProducts()
    res.render('index', {products: productsList});
})

viewsRouter.get ('/realtimeproducts', async (req, res) => {
    res.render('realTimeProducts');
})

export default viewsRouter;