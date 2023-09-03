import { Router } from 'express';
import passport from 'passport';
import userService from '../dao/user.service.js';
import errorsType from '../utils/errors.js';
import CustomErrors from '../utils/customErrors.js';
import { generateUserInfoError, generateLoginError, generateRegisterError, generateDelogError, generateAuthenticationError } from '../utils/info.js';

const usersRouter = Router();

usersRouter.get('/', async (req, res) => {
	try {
		let users = await userService.getAll()
		res.send(users)
	} catch (error) {
		res.status(500).json({error: CustomErrors.createError("Error de usuarios", generateUserInfoError(), 'Show Users Error', errorsType.USER_ERROR)})
	}
})

usersRouter.post('/', async (req, res) => {
	try {
		const userData = req.body;
		let users = await userService.createUser(userData)
		res.send(users)
	} catch (error) {
		res.status(500).json({error: CustomErrors.createError("Error de creación", generateAuthenticationError(), 'Authentication Error', errorsType.AUTHENTICATION_ERROR)})
	}
})

usersRouter.post('/register', passport.authenticate('register') , async (req, res) => {
	try {
		res.redirect('/')
	} catch (error) {
		res.status(500).json({error: CustomErrors.createError("Error de creación", generateRegisterError(), 'Register Error', errorsType.REGISTER_ERROR)})
	}
});

usersRouter.post('/login', passport.authenticate('login'), async (req, res) => {
	try {
		req.session.user = req.user;
		res.redirect('/')
	} catch (error) {
		res.status(500).json({error: CustomErrors.createError("Error de logueo", generateLoginError(), 'Login Error', errorsType.LOGIN_ERROR)});
	}
});

usersRouter.post('/logout', (req, res) => {
	try {
		req.session.destroy();
		res.redirect('/login');
	} catch (error) {
		res.status(500).json({error: CustomErrors.createError("Error de delogueo", generateDelogError(), 'Delog Error', errorsType.DELOGIN_ERROR)});
	}
});

export default usersRouter;
