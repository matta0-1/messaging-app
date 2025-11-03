import { Router } from "express";
import { UserRepository } from "../domain/repositories/UserRepository.js";
import { UserService } from "../services/UserService.js";
import { UserController } from "../controllers/UserController.js";

import { idParam, upsertUser, usernameParam } from "../validators/userValidators.js";

/**
 * Dependency injection
 */
const repo = new UserRepository();
const service = new UserService(repo);
const controller = new UserController(service);

export const userRoutes = Router();

userRoutes.get('/', controller.list); // List all users

userRoutes.get('/id/:id', idParam, controller.getById); // List user by id
userRoutes.get('/username/:username', usernameParam, controller.getByUsername); // List user by username

userRoutes.get('/id/:id/friends', idParam, controller.getFriendsById); // List friends of user by id
userRoutes.get('/username/:username/friends', usernameParam, controller.getFriendsByUsername); // List friends of user by username

userRoutes.put('/:id', [...idParam, upsertUser], controller.update); // modfify user by id 

userRoutes.post('/', upsertUser, controller.create); // add user

userRoutes.delete('/:id', idParam, controller.delete); // delete user by id
