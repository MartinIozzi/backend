import { Router } from "express";
import CartManager from './cartManager.js'


const cartRouter = Router();
const cartManager = new CartManager();

cartRouter.post('/',async (req, res) => {
    try {
        res.status(201).send(await cartManager.addCart())   //antes tenia el getCart, como para leer el codigo a la hora de llamarlo desde thunderclient, asi que arreglé la función y lo cambié por addCart para que se mande a la pagina.
    } catch (e) {
        res.status(400).send({e});
    }
})

cartRouter.get('/:cid', async (req, res) => {
    try {
        let cart = await cartManager.getCart();
        let cartId = cart.find((element) => {
            return element.id == req.params.cid});
        res.status(200).send(cartId);
    } catch (e) {
        res.status(400).send({e});
    }
})

cartRouter.post('/:cid/products/:pid' , async (req, res) => {
    try {
        let product = {id: req.params.pid};
        await cartManager.addProdToCart(req.params.cid, product)
        res.status(201).send(await cartManager.getCart())
    } catch (e) {
        res.status(400).send({e});
    }
})

export {cartRouter};