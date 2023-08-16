import express from "express";
import handlebars from "express-handlebars";
//import { server } from "./utils/socket.js";
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

//Parte JSON del proyecto (solo habilitar para switchear entre el JSON y mongoDB si uno de ellos está deshabilitado)
//import viewsRouter from "./routers/viewsRouter.js";
//import { cartRouter } from "./routers/cartRouter.js";
//import { productRouter } from "./routers/productRouter.js";

//const productManager = new ProductManager();

//Rutas de fs, json del proyecto
//app.use('/', viewsRouter);
//app.use('/api/products', productRouter);
//app.use('/api/carts', cartRouter);

//-------------------------------------------------------//

//Parte MongoDB del proyecto (solo habilitar para switchear entre el JSON y mongoDB si uno de ellos está deshabilitado)
import { cartRoutes } from "./routers/cart.routes.js";
import productRouter from "./dao/dao/products.router.js";
import viewsRouter from "./dao/dao/viewsRouter.js";
import { productService } from "./dao/dao/product.service.js";
import usersRouter from "./routers/user.routes.js";
import passportInit from "./config/passport.config.js";
import sessionsRoutes from "./routers/sessions.routes.js";
import config from "./config/config.js";
//import ProductManager from "./products/dao/productManager.js";


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
app.use('/', viewsRouter);
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

const socketServer = new Server(httpServer); //servidor para trabajar con sockets.

async function products(socket) {
    socket.emit('send', await productService.getProducts());
}

//const productManager = new ProductManager()

socketServer.on ('connection', async (socket) => {
    console.log("Nuevo cliente conectado");
    products(socket)

    socket.on ('add', async (product) => {
        //await productManager.addProduct(product)
        //socket.emit('send', await productManager.getProducts())
        //**SE COMENTA, PARA ASI PODER SWITCHEAR ENTRE FS Y MONGODB, en el caso, switchear los comentarios.
        await productService.addProduct(product)
        socket.emit('send', await productService.getProducts())
        products(socket)
    })

    socket.on('delete', async (id) => {
        //await productManager.deleteProduct(id);
        //**SE COMENTA, PARA ASI PODER SWITCHEAR ENTRE FS Y MONGODB, en el caso, switchear los comentarios.
        await productService.deleteProduct(id);
        products(socket)
    })
});

