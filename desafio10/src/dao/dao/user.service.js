import userModel from "../../../models/user.model.js";
import config from '../../config/config.js'

class UserService {
    constructor() {
        this.model = userModel;
    }

    async getAll(){
        return await this.model.find().lean();
    }

    async getCurrentUser(req) {
        const token = req.headers.authorization;   
        const decodedToken = jwt.verify(token, config.SECRET_KEY); // clave secreta para firmar los tokens
        const userId = decodedToken.userId;
        const user = await this.model.findById(userId);
        return user;
    }

    async getByEmail(email){
        return await this.model.findOne({email: email});
    }

    async getByName(username){
        return await this.model.findOne({username}).lean();
    }

    async createUser(userData){
        return await this.model.create(userData);
    }

    async getById(id) {
		return await this.model.findById(id);
	}
}

const userService = new UserService();

export default userService;