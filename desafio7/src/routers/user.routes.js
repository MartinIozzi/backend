import { Router } from 'express';
import userService from '../services/user.service.js';
import { cartService } from '../services/cart.service.js';

const usersRouter = Router();

usersRouter.post('/', async (req, res) => {
	const userData = req.body;
	try {
		const newUser = await userService.createUser(userData);
		const cart = await cartService.addCart();
		newUser.cart = cart._id;
		await user.save();
		res.status(201).json(newUser);
	} catch (error) {
		res.status(400).json({error});
	}
});

usersRouter.post('/auth', async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await userService.getByEmail(email);

		if (!user) throw new Error('Usuario no encontrado');
		if (user.password !== password) throw new Error('Contraseña incorrecta');

		req.session.user = user;

		res.redirect('/');
	} catch (error) {
		res.status(400).json({error});
	}
});

usersRouter.post('/logout', (req, res) => {
	req.session.destroy();
	res.redirect('/login');
});

export default usersRouter;
