import dotenv from 'dotenv';

let path = '.env'

dotenv.config({ path });

export default {
	PORT: process.env.PORT,
	SECRET_KEY: process.env.SECRET_KEY,
	MONGO_URL: process.env.MONGO_URL,
	PERSISTENCE: process.env.PERSISTENCE
};
