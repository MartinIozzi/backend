import { Router } from "express";
import { isAuth, isGuest } from "../middlewares/auth.middleware.js";
import ProductRepository from "../repository/project.repository.js";
import { generateProducts } from "../utils/generate.js";
import errorsType from '../utils/errors.js';
import CustomErrors from '../utils/customErrors.js';
import { generateRenderError } from '../utils/info.js';
//Importo DAOs
import { productService } from "../dao/dbManagers/product.service.js";
import ProductManager from "../dao/fsManagers/productManager.js";


const viewsRoutes = Router();
const controller = new ProductRepository(productService)

viewsRoutes.get ('/', isAuth, async (req, res) => {
    const { user } = req.session;
    const cartId = user.cart;
    const token = req.params;
    delete user.password;
    
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort === 'desc' ? { desc: -1 } : { asc: 1 };
    const query = req.query.query || '';
    const page = parseInt(req.query.page) || 1;

    try {
        const prods = await controller.find(limit, sort, query, page);
        const productList = await controller.get();
        res.render('index', {products: productList, user: user, prods, cartId, token: token.token, title: 'Lista de productos'})
      } catch (err) {
        res.status(500).json(CustomErrors.createError("Error de renderizado", generateRenderError(), 'Render Error', errorsType.RENDER_ERROR));
    }
});

viewsRoutes.get ('/realtimeproducts', async (req, res) => {
    const { user } = req.session;
    try {
        res.render('realTimeProducts', {title: 'Productos en tiempo real', user: user});
    } catch (err) {
        res.status(500).json(CustomErrors.createError("Error de renderizado", generateRenderError(), 'Render Error', errorsType.RENDER_ERROR));
    }
});

viewsRoutes.get ('/products', async (req, res) => {
    const { user } = req.session;
    const cartId = req.session.user.cart
    const products = await controller.get()
    try {
        res.render('products', {cartId, products, user: user, title: 'Productos'});
    } catch (err) {
        res.status(500).json(CustomErrors.createError("Error de renderizado", generateRenderError(), 'Render Error', errorsType.RENDER_ERROR));
    }
});

viewsRoutes.get('/carts', async (req, res) => {
    const { user } = req.session;
    try{
        res.render('carts', { title: 'Carrito', user: user});
    } catch(err){
        res.status(500).json(CustomErrors.createError("Error de renderizado", generateRenderError(), 'Render Error', errorsType.RENDER_ERROR));
    }
});

viewsRoutes.get('/login', isGuest, (req, res) => {
    try{
        res.render('login', {title: 'Inicio de sesión'});
    }catch(err){
        res.status(500).json(CustomErrors.createError("Error de renderizado", generateRenderError(), 'Render Error', errorsType.RENDER_ERROR));
    }
});

viewsRoutes.get('/register', isGuest, (req, res) => {
    try {
        res.render('register', {title: 'Registro'});
    } catch (err) {
        res.status(500).json(CustomErrors.createError("Error de renderizado", generateRenderError(), 'Render Error', errorsType.RENDER_ERROR));
    }
});

viewsRoutes.get('/chat', isAuth, (req, res) => {
    const { user } = req.session;
    try {
        const users = {user: req.user}
        res.render('chat', {users, user: user});
    } catch (error) {
        res.status(500).json(CustomErrors.createError("Error de renderizado", generateRenderError(), 'Render Error', errorsType.RENDER_ERROR));
    }
});

viewsRoutes.get('/mockingproducts', (req, res) => {
    try {
        res.json(generateProducts());
    } catch (error) {
        res.status(500).json(CustomErrors.createError("Error de renderizado", generateRenderError(), 'Render Error', errorsType.RENDER_ERROR));
    }
});

viewsRoutes.get('/mail', (req, res) => {
    const { user } = req.session;
    try{
        res.render('mail', {title: 'Reestablecer contraseña', user: user})
    } catch (error) {
        res.status(500).json(CustomErrors.createError("Error de renderizado", generateRenderError(), 'Render Error', errorsType.RENDER_ERROR));
    }
})

viewsRoutes.get('/emailsent', (req, res) => {
    const { user } = req.session;
    try {
        res.render('emailsent', { title: 'Se envio email de restablecimiento', user: user});
    } catch (error) {
        res.status(500).json(CustomErrors.createError("Error de renderizado", generateRenderError(), 'Render Error', errorsType.RENDER_ERROR));
    }
});


export default viewsRoutes;