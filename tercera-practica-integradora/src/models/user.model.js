import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
		type: String,
		unique: true,
		required: true,
		index: true,
	},
	password: String,
	age: Number,
	img: String,
	cart: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'carts'
	},
	rol: {
		type: String,
		enum: ['user', 'premium', 'admin'],
		default: 'user',
	},
})

const userModel = mongoose.model('users', userSchema)

export default userModel;

