import { Server } from 'socket.io';
import { productService } from '../services/product.service.js';
import http from 'http'
import express from 'express'

//import ProductManager from '../services/productManager.js';
//const productManager = new ProductManager()

const app = express();
export const server = http.createServer(app)
const socketServer = new Server(server); //servidor para trabajar con sockets.

async function products(socket) {
    socket.emit('send', await productService.getProducts());
}

socketServer.on ('connection', async (socket) => {
    console.log("Nuevo cliente conectado");
    products(socket)

    socket.on ('add', async (product) => {
        //await productManager.addProduct(product)
        await productService.addProduct(product)
        //socket.emit('send', await productManager.getProducts())   **SE COMENTA, PARA ASI PODER SWITCHEAR ENTRE FS Y MONGODB, en el caso, switchear los comentarios.
        socket.emit('send', await productService.getProducts())
        products(socket)
    })

    socket.on('delete', async (id) => {
        //await productManager.deleteProduct(id);   **SE COMENTA, PARA ASI PODER SWITCHEAR ENTRE FS Y MONGODB, en el caso, switchear los comentarios.
        await productService.deleteProduct(id);
        products(socket)
    })
});