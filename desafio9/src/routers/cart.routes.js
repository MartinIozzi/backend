import { Router } from "express";
import { cartService } from "../controllers/cart.service.js";
import { productService } from "../controllers/product.service.js";

const cartRoutes = Router();

cartRoutes.get('/', async (req, res) => {
    try {
        res.send(await cartService.getCart())
    } catch (err) {
        res.status(500).send({err})
    }
})

cartRoutes.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        res.status(200).send(await cartService.getCartById(cartId));
    } catch (e) {
        res.status(400).send('Error al obtener el carrito', {e});
    }
})

cartRoutes.post('/',async (req, res) => {
    try {
        const cartId = await cartService.createCart();
        res.cookie('cartId', cartId,{
        maxAge: 1000,
        httpOnly:true
    })
        res.redirect('/products')
    } catch (e) {
        res.status(400).send({e: e.message });
    }
});

cartRoutes.post('/:cid/products/:pid' , async (req, res) => {
    const productId = req.params.pid;
    const cartId = req.params.cid;
    try {
        const product = await productService.getProducts() 
        await cartService.addProdToCart(cartId, productId);
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
        await cartService.deleteProdFromCart(prodId, cartId);
        res.status(201).send("Producto eliminado del carrito");
    } catch (err) {
        res.status(400).send({err});
    }
})

cartRoutes.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        await cartService.deleteAllProd(cartId);
        res.status(201).send("Todos los productos fueron eliminados");
    } catch (err) {
        res.status(400).send({err});
    }
})

cartRoutes.put('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const products = req.body;

        res.status(200).send(await cartService.updateCart(cartId, products));
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

      await cartService.updateProductQuantity(cartId, productId, quantity);
      res.status(200).send("Se ejecutó exitosamente");
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  });

export {cartRoutes};