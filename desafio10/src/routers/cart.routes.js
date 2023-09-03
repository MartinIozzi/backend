import { Router } from "express";
import ProductRepository, {UserRepository, CartRepository} from "../repository/project.repository.js";
//Importo DAOs
import { productService } from "../daos/dbManagers/product.service.js";   //DB MONGO  
import ProductManager from "../daos/fsManagers/productManager.js";      //FILE SYSTEM
import { cartService } from "../daos/dbManagers/cart.service.js";   //DB MONGO
import cartManager from "../daos/fsManagers/cartManager.js";
import TicketService from "../daos/dbManagers/ticket.service.js";
import userService from "../daos/dbManagers/user.service.js";

const cartRoutes = Router();

const ticketService = new TicketService()
const userController = new UserRepository(userService)
const productController = new ProductRepository(productService)
const controller = new CartRepository(cartService)

cartRoutes.get('/', async (req, res) => {
    try {
        res.send(await controller.get())
    } catch (err) {
        res.status(500).send({err})
    }
});

cartRoutes.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        res.status(200).send(await controller.getById(cartId));
    } catch (e) {
        res.status(400).send('Error al obtener el carrito', {e});
    }
});

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
        const addedProduct = await controller.add(cartId, productId);
        res.status(201).send(addedProduct);
    } catch (e) {
        res.status(400).send({e});
    }
});

cartRoutes.get('/:cid/purchase', async (req, res) => {
    try {
        res.status(201).send(await ticketService.getTickets())
    } catch (error) {
        console.log(error);
    }
});

cartRoutes.post('/:cid/purchase', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await controller.getById(cartId);
        const user = await userController.getByCartId(cartId);
        const purchaser = user.email;
        let amount = 0;

        let incompletedProducts = []

        for (const product of cart.products){
            const products = await productController.getById(product.product)
            if(products.stock >= product.quantity) {
                products.stock -= product.quantity;
                await productController.update(products._id, products)
                amount += products.price * product.quantity;
            } else {
                incompletedProducts.push(products._id.toString());
            }
        }
        await ticketService.createTicket(purchaser, amount);

        const cartProducts = cart.products.filter(x => 
            incompletedProducts.includes(x.product.toString()));
        
        await controller.update(cartId, cartProducts);
        
        res.send('Se ejecutó correctamente');
    } catch (error) {
        console.log(error);
    }
})

cartRoutes.post('/products/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
      const product = await productController.get(productId);
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
});

cartRoutes.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        await controller.deleteAllProd(cartId);
        res.status(201).send("Todos los productos fueron eliminados");
    } catch (err) {
        res.status(400).send({err});
    }
});

cartRoutes.put('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const products = req.body;

        res.status(200).send(await controller.update(cartId, products));
    } catch (error) {
        res.status(400).send({error: error.message});
    }
});

cartRoutes.put('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;
    try {

      await controller.updateProdQuan(cartId, productId, quantity);
      res.status(200).send("Se ejecutó exitosamente");
    } catch (error) {
      res.status(400).send({error: error.message});
    }
});

export {cartRoutes};