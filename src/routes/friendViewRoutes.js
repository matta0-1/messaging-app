import { Router } from "express";

import { FriendRepository } from "../domain/repositories/FriendRepository.js";
import { FriendService } from "../services/FriendService.js";
import { FriendViewController } from "../controllers/FriendViewController.js";

import { idParam, updateFriend, insertFriend } from "../validators/FriendValidators.js";

/**
 * Dependency injection
 */

const repo = new FriendRepository();
const service = new FriendService(repo);
const controller = new FriendViewController(service);

export const friendViewRoutes = Router();

friendViewRoutes.put('/accept/:id', idParam, controller.accept); // CHANGE TO PUT
friendViewRoutes.put('/block/:id', idParam, controller.block); // CHANGE TO PUT

friendViewRoutes.delete('/delete/:id', idParam, controller.delete); // CHANGE TO DELETE
