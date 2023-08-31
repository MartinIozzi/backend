import { Router } from "express";
import ProductRepository from "../factory/project.repository.js";
import errorsType from '../utils/errors.js';
import CustomErrors from '../utils/customErrors.js';
import { generateProductsError } from "../utils/info.js";
//importo DAOs
import ProductManager from "../controllers/fs/productManager.js";
import { productService } from "../controllers/product.service.js";

/*
Para cambiar de persistencia, en la de ProductManager hay que poner new ProductManager(),
en la de productService no, porque no lo exporté como default
*/
const controller = new ProductRepository(productService);
const productRouter = Router();

productRouter.get('/', async (req, res) => {
    try {
        const products = await controller.get();
        res.json(products);
    } catch (error) {
        res.status(500).json({error: CustomErrors.createError("Error de productos", generateProductsError(), 'Show Products Error', errorsType.PRODUCTS_ERROR)});
    }
});

productRouter.get("/:pid" , async (req, res)=> {
    const pid = req.params.pid;
    try {
        let products = await controller.getById(pid)
        res.send(products);
    } catch (error){
		res.status(500).json({error: CustomErrors.createError("Error de productos", generateProductsError(), 'Show Product Error', errorsType.PRODUCTS_ERROR)});
    }
});

productRouter.post('/', async (req, res) => {
    try {
        const product = await controller.add(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({error: CustomErrors.createError("Error de productos", generateProductsError(), 'Add Product Error', errorsType.PRODUCTS_ERROR)});
    }
});

productRouter.put('/:pid', async (req, res) => {
    try{
        const id = parseInt(req.params.pid);
        const updatedProduct = req.body;
        const updateProd = await controller.update(id, updatedProduct);
        res.status(200).json(updateProd);
    } catch (error) {
		res.status(500).json({error: CustomErrors.createError("Error de productos", generateProductsError(), 'Update Product Error', errorsType.PRODUCTS_ERROR)});
    }
})

productRouter.delete('/:pid' , async (req, res) => {
    try {
        let id = (req.params.pid);
        res.status(200).send(await controller.delete(id))
    } catch (error) {
		res.status(500).json({error: CustomErrors.createError("Error de productos", generateProductsError(), 'Delete Product Error', errorsType.PRODUCTS_ERROR)});
    }
})
export default productRouter;