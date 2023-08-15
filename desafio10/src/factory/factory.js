import mongoose from "mongoose";
import config from "../config/config.js";

export let info;
switch(config.PERSISTENCE){
    case "MONGO":
        const connection = mongoose.connect(config.MONGO_URL)
        const {default:infoMongo} = await import ('../dao/dao/product.service.js');
        info = infoMongo;
        break;
    case "MEMORY":
        const {default:infoMemory} = await import ('../dao/dao/productManager.js')
        info = infoMemory;
        break;
}