import { Router } from "express";

import { MessageRepository } from "../domain/repositories/MessageRepository.js";
import { MessageService } from "../services/MessageService.js";
import { MessageController } from "../controllers/MessageController.js";

import { idParam, upsertMessage } from "../validators/MessageValidators.js";

/**
 * Dependency injection
 */

const repo = new MessageRepository();
const service = new MessageService(repo);
const controller = new MessageController(service);

export const messageRoutes = Router();


messageRoutes.get('/', controller.list);
messageRoutes.get('/:id', idParam, controller.get);

messageRoutes.put('/:id', [...idParam, upsertMessage],  controller.update);

messageRoutes.post('/', upsertMessage, controller.create);

messageRoutes.delete('/:id', idParam, controller.delete);
