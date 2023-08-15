import { Router } from "express";
import ProductFactory from "../../factory/proyect.factory.js";
//importo DAOs
import ProductManager from "./productManager.js";
import { productService } from "./product.service.js";

/*
Para cambiar de persistencia, en la de ProductManager hay que poner new ProductManager(), 
en la de productService no, porque no lo exporté como default    */
const controller = new ProductFactory(productService);
const productRouter = Router();

productRouter.get('/', async (req, res) => {
    try {
        const products = await controller.get();
        res.json(products);
    } catch (error) {
        res.status(500).json({message: error.message});
    }

});

productRouter.post('/', async (req, res) => {
    try {
        const product = await controller.add(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

productRouter.put('/:pid', async (req, res) => {
    try{
        const id = parseInt(req.params.pid);
        const updatedProduct = req.body;
        const updateProd = await controller.update(id, updatedProduct);
        res.status(200).json(updateProd);
    } catch (e) {
		res.status(400).send({e});
    }
})

productRouter.delete('/:pid' , async (req, res) => {
    try {
        let id = (req.params.pid);
        res.status(200).send(await controller.delete(id))
    } catch (e) {
		res.status(400).send({e});
    }
})
export default productRouter;