import { Router } from "express";
import { UserRepository } from "../domain/repositories/UserRepository.js";
import { UserService } from "../services/UserService.js";
import { UserViewController } from "../controllers/UserViewController.js";

import { idParam } from "../validators/userValidators.js";

/**
 * Dependency injection
 */
const repo = new UserRepository();
const service = new UserService(repo);
const controller = new UserViewController(service);

export const userViewRoutes = Router();

userViewRoutes.get('/home', controller.getHomePage);
userViewRoutes.get('/friends', controller.getFriendsPage);
userViewRoutes.get('/about', controller.getAboutPage);

userViewRoutes.get('/all', controller.getAllUsersPage);

userViewRoutes.delete('/', controller.deleteAccount);
