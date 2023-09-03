import { Router } from 'express';
import passport from 'passport';
import userService from '../daos/user.service.js';

const usersRouter = Router();

usersRouter.get('/', async (req, res) => {
	try {
		let users = await userService.getAll()
		res.send(users)
	} catch (error) {
		throw new Error
	}
})

usersRouter.post('/', async (req, res) => {
	try {
		const userData = req.body;
		let users = await userService.createUser(userData)
		res.send(users)
	} catch (error) {
		throw new Error
	}
})

usersRouter.post('/register', passport.authenticate('register') , async (req, res) => {
	res.redirect('/')
});

usersRouter.post('/login', passport.authenticate('login'), async (req, res) => {
	req.session.user = req.user;
	res.redirect('/')
});

usersRouter.post('/logout', (req, res) => {
	req.session.destroy();
	res.redirect('/login');
});

export default usersRouter;
