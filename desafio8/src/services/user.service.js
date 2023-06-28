import userModel from "../../models/user.model.js";
import cartModel from "../../models/carts.model.js";

class UserService {
    constructor() {
        this.model = userModel;
    }

    async getAll(){
        return await this.model.find();
    }

    async getCurrentUser(req) {
        const token = req.headers.authorization;   
        const decodedToken = jwt.verify(token, 'l2YQI4AjpU4Ks'); // clave secreta para firmar los tokens
        const userId = decodedToken.userId;
        const user = await this.model.findById(userId);
        return user;
    }

    async getUserAndUpdateCart(req, product){
        const currentUser = await getCurrentUser(req);
        const userId = currentUser._id;
        console.log(userId);
        const user = await this.model.findById(userId);
        const cartId = user.cart;
        console.log(cartId);

        const cart = await cartModel.findByIdAndUpdate(cartId, { $push: { products: product } }, { new: true });
        return cart;
    }

    async getByEmail(email){
        return await this.model.findOne({email: email});
    }

    async createUser(userData){
        return await this.model.create(userData);
    }
}

const userService = new UserService();

export default userService;