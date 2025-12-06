/**
 * Controller for Authentication. Handles rendering login and signup pages
 */
import { validationResult } from "express-validator";
import dotenv from 'dotenv';

dotenv.config();

export class AuthController {
    /**
     * Constructs a UserController object
     * @param {AuthService} userService 
     */
    constructor(authService) {
        this.authService = authService;
    }

    _validateForm(req, res, viewName) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).render(viewName, {
                error: errors.array()[0].msg,
            });
            return true;
        }
        return false;
    }

    login = async (req, res, next) => {
        try {
            if (this._validateForm(req, res, 'login')) {
                return;
            }
            const { username, password } = req.body;
            const result = await this.authService.login(username, password);
            res.cookie('token', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax", // not strict (development)
                maxAge: 24 * 60 * 60 * 1000
            });

            return res.redirect('/home');

        } catch (e) {
            // next(e);
            res.render('login', {
                error: e.message,
            });
        }
    }

    signup = async (req, res, next) => {
        try {
            if (this._validateForm(req, res, 'signup')) {
                return;
            }

            const result = await this.authService.signup(req.body);
            res.cookie('token', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax", // not strict (development)
                maxAge: 24 * 60 * 60 * 1000
            });

            return res.redirect('/home');

        } catch (e) {
            // next(e);
            res.render('signup', {
                error: e.message,
            });
        }
    }

    showLoginPage = async (req, res, next) => {
        try {
            if (req.user) {
                return res.redirect('/home');
            }

            res.render('login', { error: null });
        } catch (e) {
            next(e)
        }
    }
    showSignUpPage = async (req, res, next) => {
        try {
            if (req.user) {
                return res.redirect('/home');
            }

            res.render('signup', { error: null });
        } catch (e) {
            next(e)
        }
    }

    logout = async (req, res) => {
        res.clearCookie('token');
        res.redirect('/auth/login');
    }
}
