import { Router } from "express";
import { UserRepository } from "../domain/repositories/UserRepository.js";
import { UserService } from "../services/UserService.js";
import { UserViewController } from "../controllers/UserViewController.js";

import { updatePassword, updateEmail } from "../validators/userValidators.js";

import { FriendRepository } from "../domain/repositories/FriendRepository.js";
import { FriendService } from "../services/FriendService.js";

/**
 * Dependency injection
 */
const repo = new UserRepository();
const service = new UserService(repo);
const controller = new UserViewController(service, new FriendService(new FriendRepository));

export const userViewRoutes = Router();

userViewRoutes.get('/home', controller.getHomePage);
userViewRoutes.get('/friends', controller.getFriendsPage);
userViewRoutes.get('/about', controller.getAboutPage);

userViewRoutes.get('/all', controller.getAllUsersPage);

userViewRoutes.delete('/', controller.deleteAccount);


userViewRoutes.get('/change-email', controller.getChangeEmailPage);
userViewRoutes.get('/change-password', controller.getChangePasswordPage);

userViewRoutes.put('/change-email', updateEmail, controller.changeEmail);
userViewRoutes.put('/change-password', updatePassword, controller.changePassword);

userViewRoutes.get('/search', controller.getSearchPage);
userViewRoutes.post('/search', controller.searchForUser);
