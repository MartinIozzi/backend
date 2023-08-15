import { Router } from "express";
import ProductFactory from "../products/factory.js";
//importo DAOs
import ProductManager from "./dao/productManager.js";
import { productService } from "./dao/product.service.js";

const viewsRouter = Router()
const controller = new ProductFactory(productService)

viewsRouter.get ('/', async (req, res) => {
    let productsList = await controller.get()
    res.render('index', {products: productsList});
})

viewsRouter.get ('/realtimeproducts', async (req, res) => {
    res.render('realTimeProducts');
})

export default viewsRouter;