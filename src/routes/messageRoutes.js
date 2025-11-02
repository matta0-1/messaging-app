import { Router } from "express";

import { MessageRepository } from "../domain/repositories/MessageRepository.js";
import { MessageService } from "../services/MessageService.js";
import { MessageController } from "../controllers/MessageController.js";

import { FriendRepository } from "../domain/repositories/FriendRepository.js";

import { idParam, upsertMessage, upsertMessageContent, upsertUserId } from "../validators/MessageValidators.js";

/**
 * Dependency injection
 */

const repo = new MessageRepository();
const service = new MessageService(repo, new FriendRepository());
const controller = new MessageController(service);

export const messageRoutes = Router();


messageRoutes.get('/', controller.list); // List all messages
messageRoutes.get('/:id', idParam, controller.get); // Get message by id

messageRoutes.get('/chats/:id', [...idParam, upsertUserId], controller.getConversation); // Get all conversation between 2 users
messageRoutes.get('/chats/:id/search', [...idParam, upsertUserId, upsertMessageContent], controller.getMessagesWithContentInConversation); // Get messages in conversation with specific content

messageRoutes.put('/edit/:id', [...idParam, upsertMessageContent], controller.editContent); // Edit message content by id
messageRoutes.put('/:id', [...idParam, upsertMessage], controller.update); // Modify message information

messageRoutes.post('/', upsertMessage, controller.create); // Create message

messageRoutes.delete('/:id', idParam, controller.delete); // Delete message
