import { Router } from 'express';
import passport from 'passport';
import userService from '../dao/dbManagers/user.service.js';
import errorsType from '../utils/errors.js';
import CustomErrors from '../utils/customErrors.js';
import { generateUserInfoError, generateLoginError, generateRegisterError, generateDelogError, generateAuthenticationError } from '../utils/info.js';
import { transporter } from '../utils/mail.js';
import logger from '../middlewares/logger.middleware.js';
import { hashPassword, comparePassword } from '../utils/encript.js';
import { generateToken } from '../middlewares/jwt.middleware.js';
import userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

const privatekey = config.SECRET_KEY;

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

usersRouter.post('/mail', async (req, res) => {
	const { user } = req.session;
	const userEmail = user.email
	try {
		const userMail = await userService.getByEmail(userEmail)
		const token = generateToken(user);
		
		const mailOptions = {
			from: 'Reestablecer contraseña <martiniozzi103@gmail.com>',
			to: userMail.email,
			subject: 'Reestablecimiento de contraseña',
			html: `
			  <div style="background-color: rgb(243, 215, 179); padding: 20px;">
				<h1>Reestablece tu contraseña</h1>
				<p>Haz solicitado reestablecer tu contraseña, si fue el caso, haz click en el link que se encuentra a continuación:</p>
				<a style="border-radius: 2px; text-decoration: none;" href="http://localhost:8080/mail/${token}"><button>Reestablece tu contraseña</button></a>
			  </div>
			`
		  };
		  
		  
		  transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				logger.error(error);
			}
			logger.info(`Email sent: ` + info)});
		  res.redirect('/emailsent');
	} catch (error) {
		res.status(500).json(error);
}})

usersRouter.post('/resetemail/:token', async (req, res) => {
	const actualUser = req.params.token;
	const newPassword = req.body.password;

	try {
		const decodedUser = jwt.verify(actualUser, privatekey);
		const userId = await userModel.findById(decodedUser._id)

		const hashedPasswordFromDB = userId;

		if (comparePassword(hashedPasswordFromDB, newPassword)) {
			req.logger.warn("No puede ser la misma contraseña");
		  }		  

		const hashedPass = hashPassword(newPassword)
		userId.password = hashedPass
		userId.save()

		res.redirect('/login')
	} catch (error) {
		console.log(error);
	}
});


export default usersRouter;
