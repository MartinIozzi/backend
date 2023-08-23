import { Router } from 'express';
import passport from 'passport';
import { isAuth } from '../middlewares/auth.middleware.js';

const sessionsRoutes = Router();

sessionsRoutes.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
    res.send("funciona")
});

sessionsRoutes.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
		req.session.user = req.user;
		res.redirect('/');
	}
);

sessionsRoutes.get('/current', isAuth, async (req, res) => {
	try {
		if (req.isAuthenticated()) {
			const currentUser = req.user;
			res.send(currentUser);
		}
	} catch (error) {
		res.status(500).send({error: 'error en el servidor'})
	}
});

export default sessionsRoutes;