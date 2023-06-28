import passport, { Passport } from 'passport';
import local from 'passport-local';
import userService from '../routers/user.routes';
import { comparePassword, hashPassword } from '../utils/encript.js';

//Passport local siempre pide username y password, sino devuelve error.

