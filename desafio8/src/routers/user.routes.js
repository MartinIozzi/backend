import { Router } from 'express';
import passport from 'passport';

const usersRouter = Router();

usersRouter.post('/register', passport.authenticate('register', {failureRedirect: "/failregister"}) , async (req, res) => {
	res.redirect('/')
});

usersRouter.post('/login', passport.authenticate('login'), async (req, res) => {
	req.session.user = req.user
	res.redirect('/')
});

usersRouter.post('/logout', (req, res) => {
	req.session.destroy();
	res.redirect('/login');
});

export default usersRouter;
