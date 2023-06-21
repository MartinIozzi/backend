import { Router } from "express";
import { productService } from "../services/product.service.js";

const productRoutes = Router();

productRoutes.get("/", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort === 'desc' ? -1 : 1;
  const query = req.query.query || '';  //query sería el tipo de producto el cual se va a filtrar por query (URL).  //si no hay query seleccionada, hace una busqueda general.
  const page = parseInt(req.query.page) || 1;

  try {
    //paso como parametro, el query y el limit para que, desde la funcion creada, se pueda establecer el limite e igualar el query al type del producto.
    let products = (await productService.find(query, limit));
    products.sort((a, b) => (a.price - b.price) * sort);

    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / limit);
    if (page < 1 || page > totalPages) {
      return res.status(400).send({ error: 'Invalid page number' });
    }

    const skip = (page - 1) * limit;
    products = products.slice(skip, skip + limit);

    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    const nextPage = hasNextPage ? page + 1 : null;
    const prevPage = hasPrevPage ? page - 1 : null;
    const prevLink = hasPrevPage ? `/products?page=${prevPage}&limit=${limit}&sort=${sort}&query=${query}` : null;
    const nextLink = hasNextPage ? `/products?page=${nextPage}&limit=${limit}&sort=${sort}&query=${query}` : null;

    res.send({
      status: 'success',
      payload: products,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink
    });
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

export {productRoutes};