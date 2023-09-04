import winston from 'winston';
import config from '../config/config.js';
import levelOptions from '../utils/logger.js';

let logger = winston.createLogger({
    levels: levelOptions.levels,
    transports: [
        new winston.transports.Console({ level: 'info',
    format: winston.format.combine(
        winston.format.colorize({ colors: levelOptions.colors }),
        winston.format.simple()
    ) 
}),
    new winston.transports.File({ 
        filename: './errors.log', 
        level: 'error', 
        format: winston.format.simple()
    })
]
});

if (config.ENVIROMENT === "development"){
    logger = winston.createLogger({
        transports: [
            new winston.transports.Console({ level: 'debug' })
        ]
    })
}

export default logger;