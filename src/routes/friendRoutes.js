import { Router } from "express";

import { FriendRepository } from "../domain/repositories/FriendRepository.js";
import { FriendService } from "../services/FriendService.js";
import { FriendController } from "../controllers/FriendController.js";

import { idParam, updateFriend, insertFriend } from "../validators/FriendValidators.js";

/**
 * Dependency injection
 */

const repo = new FriendRepository();
const service = new FriendService(repo);
const controller = new FriendController(service);

export const friendRoutes = Router();

friendRoutes.get('/', controller.list); // List all friends
friendRoutes.get('/details', controller.getAllWithDetails); // List all friends with details
friendRoutes.get('/:id', idParam, controller.get); // List friend row by id

friendRoutes.put('/:id', [...idParam, updateFriend], controller.update); // modify friend row by id
friendRoutes.put('/accept/:id', idParam, controller.accept); // modify friend row by id
friendRoutes.put('/block/:id', idParam, controller.block); // modify friend row by id

friendRoutes.post('/', insertFriend, controller.create); // add friend

friendRoutes.delete('/:id', idParam, controller.delete); // delete friend by id
