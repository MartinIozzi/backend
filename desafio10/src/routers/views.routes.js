import { Router } from "express";
import { isAuth, isGuest } from "../middlewares/auth.middleware.js";
import ProductRepository from "../repository/project.repository.js";
//Importo DAOs
import { productService } from "../daos/dbManagers/product.service.js";
import ProductManager from "../daos/fsManagers/productManager.js";


const viewsRoutes = Router();
const controller = new ProductRepository(productService)

viewsRoutes.get ('/', isAuth, async (req, res) => {
    const { user } = req.session;
    const cartId = user.cart;
    delete user.password;
    
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort === 'desc' ? { desc: -1 } : { asc: 1 };
    const query = req.query.query || '';
    const page = parseInt(req.query.page) || 1;

    try {
        const prods = await controller.find(limit, sort, query, page);
        const productList = await controller.get();
        res.render('index', {products: productList, user, prods, cartId, title: 'Lista de productos'})
      } catch (err) {
        res.status(500).send("no funciona el render", err);
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
    const cartId = req.session.user.cart
    const products = await controller.get()
    try {
        res.render('products', {cartId, products, title: 'Productos'});
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

viewsRoutes.get('/chat', isAuth, (req, res) => {
    try {
        const user = {user: req.user}
        res.render('chat', user);
    } catch (error) {
        res.status(500).send({error})
    }
});
  

export default viewsRoutes;