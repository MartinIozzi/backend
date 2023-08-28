import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import { Server } from "socket.io";
import session from 'express-session';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import passport from "passport";

const app = express();

app.use(express.static('public/'));
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.engine('handlebars', handlebars.engine());
app.set('views' , 'views/' );
app.set('view engine','handlebars');

//-------------------------------------------------------//

import { cartRoutes } from "./routers/cart.routes.js";
import productRouter from "./routers/products.routes.js";
import ProductRepository from "./factory/project.repository.js";
import { productService } from "./controllers/product.service.js";
import ProductManager from "./controllers/fs/productManager.js";
import usersRouter from "./routers/user.routes.js";
import passportInit from "./config/passport.config.js";
import sessionsRoutes from "./routers/sessions.routes.js";
import config from "./config/config.js";
import viewsRoutes from "./routers/views.routes.js";


//Cookies
app.use(cookieParser(config.SECRET_KEY));

//Session
app.use(
    session({
        store: MongoStore.create({
			mongoUrl: config.MONGO_URL,
			mongoOptions: {
				useNewUrlParser: true,
                useUnifiedTopology: true
			},
			ttl: 7000,
		}),
    secret: config.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
}))

//Passport
passportInit();
app.use(passport.initialize());
app.use(passport.session());

//Rutas de MongoDB
app.use('/', viewsRoutes);
app.use('/api/session', sessionsRoutes);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRoutes);
app.use('/api/users', usersRouter);

//Connect MongoDB
mongoose.connect(config.MONGO_URL);

//-------------------------------------------------------//

const httpServer = app.listen(config.PORT, () => {
    return console.log(`Listening Port: ${config.PORT}`)
});

const controller = new ProductRepository(productService)

const socketServer = new Server(httpServer); //servidor para trabajar con sockets.

async function products(socket) {
    socket.emit('send', await controller.get());
}

socketServer.on ('connection', async (socket) => {
    console.log("Nuevo cliente conectado");
    products(socket)

    socket.on ('add', async (product) => {
        await controller.add(product)
        socket.emit('send', await controller.get());
        products(socket)
    })

    socket.on('delete', async (id) => {
        await controller.delete(id);
        products(socket)
    })
});