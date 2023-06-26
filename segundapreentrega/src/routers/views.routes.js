import { Router } from "express";
import { productService } from "../services/product.service.js";

const viewsRoutes = Router();

viewsRoutes.get ('/', async (req, res) => {
        const limit = parseInt(req.query.limit) || 10;
        const sort = req.query.sort === 'desc' ? -1 : 1;
        const query = req.query.query || '';
        const page = parseInt(req.query.page) || 1;
        try {
            const prods= await productService.findWithPagination(limit, sort, query, page)
            const productsList = await productService.getProducts();
            res.send(prods)
          } catch (err) {
            res.status(500).send({err});
        }
});

viewsRoutes.get ('/realtimeproducts', async (req, res) => {
    try {
        res.render('realTimeProducts', {title: 'Productos en tiempo real'});
    } catch (err) {
        res.status(500).send({ err });
    }
})

viewsRoutes.get ('/products', async (req, res) => {
    try {
        res.render('products', {title: 'Productos'});
    } catch (err) {
        res.status(500).send({err})
    }
})

viewsRoutes.get('/carts', async (req, res) => {
    try{
        res.render('carts', { title: 'Carrito'});
    } catch(err){
        res.status(500).send({err});
    }
})

export default viewsRoutes;