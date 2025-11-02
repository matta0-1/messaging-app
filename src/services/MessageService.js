/**
 * The MessageService class contains methods to perform user-related actions
 */

import { MessageDTO } from "../domain/dto/MessageDTO.js";

export class MessageService {
    /**
     * Constructs a MessageService object
     * @param {MessageRepository} messageRepository
     */
    constructor(messageRepository, friendRepository) {
        this.messageRepository = messageRepository;
        this.friendRepository = friendRepository;
    }

    /**
     * Creates a message
     * @param {Object} data
     * @returns MessageDTO
     */
    async createMessage(data) {
        try {
            if (!data || !data.content || !data.senderId || !data.receiverId) {
                throw new Error(`Missing required fields: content, sender id, receiver id`);
            }
            if (data.senderId === data.receiverId) {
                throw new Error('Cannot send message to self')
            }
            if (!await this.friendRepository.areFriends(data.senderId, data.receiverId)) {
                throw new Error(`Users ${data.senderId} and ${data.receiverId} are not friends`);
            }
            const message = await this.messageRepository.create(data);
            return MessageDTO.fromEntity(message);
        } catch (error) {
            throw new Error(`Failed to create message: ${error.message}`);
        }
    }

    /**
     * Updates data of a message
     * @param {int} id
     * @param {Object} data 
     * @returns MessageDTO if successful, null otherwise
     */
    async updateMessage(id, data) {
        try {
            if (!id || isNaN(id)) {
                throw new Error(`Invalid message id`);
            }
            if (!data || Object.keys(data).length === 0) {
                throw new Error(`No data provided for update`);
            }

            if (data.senderId === data.receiverId) {
                throw new Error('Cannot send message to self')
            }
            if (!await this.friendRepository.areFriends(data.senderId, data.receiverId)) {
                throw new Error(`Users ${data.senderId} and ${data.receiverId} are not friends`);
            }
            const message = await this.messageRepository.update(id, data);
            return message ? MessageDTO.fromEntity(message) : null;
        } catch (error) {
            throw new Error(`Failed to update message: ${error.message}`);
        }
    }

    /**
     * Lists all messages
     * @returns List<MessageDTO>
     */
    async listMessages() {
        try {
            const messages = await this.messageRepository.findAll();
            return messages.map(message => MessageDTO.fromEntity(message));
        } catch (error) {
            throw new Error(`Failed to list messages: ${error.message}`);
        }
    }

    /**
     * Finds message by id
     * @param {int} id 
     * @returns MessageDTO if successful, null otherwise
     */
    async getMessageById(id) {
        try {
            if (!id || isNaN(id)) {
                throw new Error(`Invalid message id`);
            }
            const message = await this.messageRepository.findById(id);
            return message ? MessageDTO.fromEntity(message) : null;
        } catch (error) {
            throw new Error(`Failed to get message: ${error.message}`);
        }
    }

    /**
     * Deletes message by id
     * @param {int} id 
     * @returns int
     */
    async deleteMessage(id) {
        try {
            if (!id || isNaN(id)) {
                throw new Error(`Invalid message id`);
            }
            return await this.messageRepository.delete(id);
        } catch (error) {
            throw new Error(`Failed to delete message: ${error.message}`);
        }
    }

    /**
     * Modifies message content
     * @param {int} id 
     * @param {Object} data 
     * @returns MessageDTO if successful, null otherwise
     */
    async editMessage(id, data) {
        try {
            if (!id || isNaN(id)) {
                throw new Error(`Invalid message id`);
            }
            if (!data) {
                throw new Error(`Content for edited message not provided`);
            }
            if (!data.content) {
                throw new Error(`Content for edited message cannot be empty. Delete the message to remove contents`);
            }

            const message = await this.messageRepository.editContent(id, data);
            return message ? MessageDTO.fromEntity(message) : null;
        } catch (error) {
            throw new Error(`Failed to edit message: ${error.message}`);
        }
    }

    /**
     * Lists all messages between 2 users
     * @param {int} user1Id 
     * @param {int} user2Id
     * @returns List<MessageDTO> if conversation exists, null otherwise
     */
    async listConversation(user1Id, data) {
        try {
            if (!user1Id || isNaN(user1Id) || !data || !data.user2Id) {
                throw new Error(`Invalid id for sender or receiver`);
            }

            const messages = await this.messageRepository.findConversation(user1Id, data);

            return messages[0] ? messages.map(message => MessageDTO.fromEntity(message)) : null;
        } catch (error) {
            throw new Error(`Failed to list conversation: ${error.message}`);
        }
    }

    /**
     * Lists all messages in a conversation between 2 users that contain a specific string
     * @param {int} user1Id 
     * @param {Object} data 
     * @returns List<MessageDTO> if conversation exists and contains content, null otherwise
     */
    async searchInConversation(user1Id, data) {
        try {
            if (!user1Id || isNaN(user1Id) || !data || !data.user2Id) {
                throw new Error(`Invalid id for sender or receiver`);
            }
            if (!data.content) {
                throw new Error("Invalid message content");
            }

            const messages = await this.messageRepository.searchInConversation(user1Id, data);
            return messages[0] ? messages.map(message => MessageDTO.fromEntity(message)) : null;
        } catch (error) {
            throw new Error(`Failed to list conversation: ${error.message}`);
        }
    }
}
