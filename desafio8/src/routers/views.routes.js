import { Router } from "express";
import { productService } from "../services/product.service.js";
import { isAuth, isGuest } from "../middlewares/auth.middleware.js";

const viewsRoutes = Router();

viewsRoutes.get ('/', isAuth, async (req, res) => {
        const { user } = req.session;
        delete user.password;
        
        const limit = parseInt(req.query.limit) || 10;
        const sort = req.query.sort === 'desc' ? -1 : 1;
        const query = req.query.query || '';
        const page = parseInt(req.query.page) || 1;

        try {
            const prods = await productService.findWithPagination(limit, sort, query, page)
            const productList = await productService.getProducts();
            res.render('index', {products: productList, user, prods, title: 'Lista de productos'})
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
    const cid = req.params.cid;
    try {
        res.render('products', {title: 'Productos', cid: cid});
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

viewsRoutes.get('/login', isGuest, (req, res) => {
    try{
        res.render('login', {title: 'Inicio de sesión'});
    }catch(err){
        res.status(500).send({err});
    }
})

viewsRoutes.get('/register', isGuest, (req, res) => {
    try {
        res.render('register', {title: 'Registro'});
    } catch (err) {
        res.status(500).send({err})
    }
})

export default viewsRoutes;