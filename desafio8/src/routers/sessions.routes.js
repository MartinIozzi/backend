import { Router } from 'express';
import passport from 'passport';

const sessionsRoutes = Router();

sessionsRoutes.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
    res.send("funciona")
});

sessionsRoutes.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
		req.session.user = req.user;
		res.redirect('/');
	}
);