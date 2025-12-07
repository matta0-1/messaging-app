import { Router } from "express";
import { UserRepository } from "../domain/repositories/UserRepository.js";
import { AuthService } from "../services/AuthService.js";
import { AuthController } from "../controllers/AuthController.js";

import { idParam, upsertUser, usernameParam } from "../validators/userValidators.js";

/**
 * Dependency injection
 */
const repo = new UserRepository();
const service = new AuthService(repo);
const controller = new AuthController(service);

export const authRoutes = Router();

authRoutes.get('/login', controller.showLoginPage);
authRoutes.get('/signup', controller.showSignUpPage);


authRoutes.post('/login', controller.login);
authRoutes.post('/signup', upsertUser, controller.signup);

authRoutes.post('/logout', controller.logout);
