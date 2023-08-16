import { Router } from "express";
import { CartFactory } from "../factory/project.factory.js";
//Importo DAOs
import { productService } from "../controllers/product.service.js";
import { cartService } from "../controllers/cart.service.js";   //DB MONGO
import CartManager from "../controllers/fs/cartManager.js";    //FILE SYSTEM

const cartRoutes = Router();
const controller = new CartFactory(new CartManager())

cartRoutes.get('/', async (req, res) => {
    try {
        res.send(await controller.get())
    } catch (err) {
        res.status(500).send({err})
    }
})

cartRoutes.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        res.status(200).send(await controller.getById(cartId));
    } catch (e) {
        res.status(400).send('Error al obtener el carrito', {e});
    }
})

cartRoutes.post('/',async (req, res) => {
    try {
        const cartId = await controller.create();
        res.cookie('cartId', cartId,{
        maxAge: 1000,
        httpOnly:true
    })
        res.redirect('/')
    } catch (e) {
        res.status(400).send({e: e.message });
    }
});

cartRoutes.post('/:cid/products/:pid' , async (req, res) => {
    const productId = req.params.pid;
    const cartId = req.params.cid;
    try {
        const product = await productService.getProducts() 
        await controller.add(cartId, productId);
        res.status(201).send(product);
    } catch (e) {
        res.status(400).send({e});
    }
})

cartRoutes.post('/products/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
      const product = await productService.getProducts(productId);
      res.status(201).send(product);
    } catch (error) {
      console.error(error);
      res.status(400).send({ error: 'Error al agregar el producto al carrito' });
    }
  });


cartRoutes.delete('/:cid/products/:pid', async (req, res) => {
    try{
        const prodId = req.params.pid;
        const cartId = req.params.cid;
        await controller.deleteProd(prodId, cartId);
        res.status(201).send("Producto eliminado del carrito");
    } catch (err) {
        console.error(err);
        res.status(400).send("No se pudo eliminar el producto del carrito");
    }
})

cartRoutes.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        await controller.deleteAllProd(cartId);
        res.status(201).send("Todos los productos fueron eliminados");
    } catch (err) {
        res.status(400).send({err});
    }
})

cartRoutes.put('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const products = req.body;

        res.status(200).send(await controller.update(cartId, products));
    } catch (err) {
        res.status(400).send({ err });
    }
  }
);

cartRoutes.put('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;
    try {

      await controller.updateProdQuan(cartId, productId, quantity);
      res.status(200).send("Se ejecutó exitosamente");
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  });

export {cartRoutes};