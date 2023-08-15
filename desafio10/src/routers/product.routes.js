import { Router } from "express";
import { productService } from "../products/dao/product.service.js";

const productRoutes = Router();

productRoutes.get("/", async (req, res) => {
  try {
    let products = await productService.getProducts();
    res.send(products);
  } catch (err) {
    res.status(400).send({err});
  }
});

productRoutes.get("/:pid" , async (req, res)=> {
    const pid = req.params.pid;
    try {
        let products = await productService.getProductByID(pid)
        res.send(products);
    } catch (e){
		res.status(400).send({e});
    }
});

productRoutes.post("/", async (req, res) => {
    try {
        let addedProduct = req.body;
        let products = await productService.addProduct(addedProduct)
		res.status(201).send(products);
    } catch (e) {
		res.status(400).send({e});
    }
});

productRoutes.put('/:pid', async (req, res) => {
    try {
        let id = parseInt(req.params.pid);
        res.status(200).send(await productService.updateProduct(id))
    } catch (e) {
		res.status(400).send({e});
    }
})

productRoutes.delete('/:pid' , async (req, res) => {
    const id = req.params.pid;
    try {
        res.status(200).send(await productService.deleteProduct(id))
    } catch (e) {
		res.status(400).send({e});
    }
})

//export {productRoutes};