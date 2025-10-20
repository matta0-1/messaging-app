import { Router } from "express";
import { UserRepository } from "../domain/repositories/UserRepository.js";
import { UserService } from "../services/UserService.js";
import { UserController } from "../controllers/UserController.js";

import { idParam, upsertUser } from "../validators/userValidators.js";

/**
 * Dependency injection
 */
const repo = new UserRepository();
const service = new UserService(repo);
const controller = new UserController(service);

export const userRoutes = Router();

userRoutes.get('/', controller.list);
userRoutes.get('/:id', idParam, controller.get);

userRoutes.put('/:id', [...idParam, upsertUser], controller.update);

userRoutes.post('/', upsertUser, controller.create);

userRoutes.delete('/:id', idParam, controller.delete);
