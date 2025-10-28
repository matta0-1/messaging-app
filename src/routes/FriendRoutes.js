import { Router } from "express";

import { FriendRepository } from "../domain/repositories/FriendRepository.js";
import { FriendService } from "../services/FriendService.js";
import { FriendController } from "../controllers/FriendController.js";

import { idParam, upsertFriend } from "../validators/FriendValidators.js";

/**
 * Dependency injection
 */

const repo = new FriendRepository();
const service = new FriendService(repo);
const controller = new FriendController(service);

export const friendRoutes = Router();

friendRoutes.get('/', controller.list);

friendRoutes.get('/details', controller.getAllWithDetails);

friendRoutes.get('/:id', idParam, controller.get);

friendRoutes.put('/:id', [...idParam, upsertFriend], controller.update);

friendRoutes.post('/', upsertFriend, controller.create);

friendRoutes.delete('/:id', idParam, controller.delete);
