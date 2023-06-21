import { Router } from "express";
import { productService } from "../services/product.service.js";

const viewsRoutes = Router();

viewsRoutes.get ('/', async (req, res) => {
    try {
        const productsList = await productService.getProducts()
        res.render('index', {products: productsList, title: 'Inicio'});
    } catch (err) {
        res.status(500).send({err})
    }
})

viewsRoutes.get ('/realtimeproducts', async (req, res) => {
    try {
        res.render('realTimeProducts', {title: 'Productos en tiempo real'});
    } catch (err) {
        res.status(500).send({ err });
    }
})

viewsRoutes.get ('/products', async (req, res) => {
    try {
        //const productsList = await productService.getProducts()
        res.render('products', {/*products: productsList,*/ title: 'Productos'});
    } catch (err) {
        res.status(500).send({err})
    }
})

viewsRoutes.get('/carts', async (req, res) => {
    try{
        const productsList = await productService.getProducts()
        res.render('carts', { title: 'Carrito'});
    } catch(err){
        res.status(500).send({err});
    }
})

viewsRoutes.get('/login', async (req, res) => {
    try{
        res.render('login', {title: 'Login'});
    } catch (err) {
        res.status(500).send({err});
    }
})

export default viewsRoutes;