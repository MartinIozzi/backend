import { Router } from "express";
import ProductRepository from "../repository/project.repository.js";
import errorsType from '../utils/errors.js';
import CustomErrors from '../utils/customErrors.js';
import { generateProductsError } from "../utils/info.js";
import { authorize } from "../middlewares/auth.middleware.js";
//importo DAOs
import ProductManager from "../dao/fsManagers/productManager.js";
import { productService } from "../dao/dbManagers/product.service.js";
import userService from "../dao/dbManagers/user.service.js";
import logger from "../middlewares/logger.middleware.js";
import userModel from "../models/user.model.js";

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

productRouter.post('/', authorize('premium'), async (req, res) => {
    const userEmail = req.user.email;
  try {
    const user = await userModel.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        if (req.user.rol !== 'premium') {
            return res.status(403).send('No tienes permiso para agregar productos.');
        }
        if (req.user.rol == 'premium') {
            const product = req.body;
            product.owner = userEmail;
            await controller.add(product);
        }
        
        socketServer.emit('send', await controller.get());
  } catch (error) {
      res.status(500).json({error: CustomErrors.createError("Error de productos", generateProductsError(), 'Add Product Error', errorsType.PRODUCTS_ERROR)});
    }
});

productRouter.put('/:pid', async (req, res) => {
    try{
        const id = req.params.pid;
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