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

usersRouter.get('/mail', async (req, res) => {
	const { user } = req.session;
	const userEmail = user.email
	console.log(userEmail);
	try {
		const user = await userService.getByEmail(userEmail)
		const token = generateToken(user);
		
		const mailOptions = {
			from: `Testing mail <"martiniozzi103@gmail.com">`,
			to: "martiniozzi103@gmail.com",
			subject: 'Test Mail',
			html: `
				<div style="background-color: rgb(221, 221, 221); padding: 20px>
					<h1>Reestablece tu contraseña</h1>
					<p>Haz solicitado reestrablecer tu contraseña, si fue el caso, haz click en el link que se encuentra a continuación:</p>
					<a style="background-color: blue; border-radius: 5px; text-decoration: none;" href="http://localhost:8080/mail/${token}">Reestablece tu contraseña</a>
				</div>
			`
		  };
	  
		  transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				logger.error(error);
			}
			logger.info(`Email sent: ` + info.response)});
		  res.redirect('/emailsent');
	} catch (error) {
		res.status(500).json(error);
}})

usersRouter.post('/resetemail/:token', async (req, res) => {
	const user = req.params.token;
	const newPassword = req.body
	const password = newPassword.password

	try {
		const decodedUser = jwt.verify(user, privatesecret);
		const userID = await userService.findById(decodedUser._id)

		if (comparePassword(decodedUser, newPassword.password)) {
			req.logger.warn("No puede ser la misma contraseña")
		}

		const HashPassword = hashPassword(password)
		userID.password = HashPassword
		userID.save()

		res.redirect('/login')
	} catch (error) {
		//agregar custom de errores//
		req.logger.error('expiro el tiempo, debe volver a enviar el email')
	}
});


export default usersRouter;
