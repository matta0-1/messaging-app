import { Router } from "express";

import { MessageRepository } from "../domain/repositories/MessageRepository.js";
import { MessageService } from "../services/MessageService.js";
import { MessageViewController } from "../controllers/MessageViewController.js";

import { FriendRepository } from "../domain/repositories/FriendRepository.js";

import { UserRepository } from "../domain/repositories/UserRepository.js";
import { UserService } from "../services/UserService.js";

import { idParam, upsertMessage, upsertMessageContent, upsertUserId } from "../validators/MessageValidators.js";

/**
 * Dependency injection
 */

const repo = new MessageRepository();
const service = new MessageService(repo, new FriendRepository());
const controller = new MessageViewController(service, new UserService(new UserRepository));

export const messageViewRoutes = Router();

messageViewRoutes.get('/:id', idParam, controller.getConversationPage); // id: user2ID
messageViewRoutes.post('/:id', idParam, controller.sendMessage); // id: user2ID

messageViewRoutes.put('/:id', idParam, controller.editContent); // id: message id
