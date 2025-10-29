import { MessageDTO } from "../domain/dto/MessageDTO.js";

export class MessageService {
    constructor(messageRepository) {
        this.messageRepository = messageRepository;
    }

    async createMessage(data) {
        try {
            if (!data || !data.content || !data.senderId || !data.receiverId) {
                throw new Error(`Missing required fields: content, sender id, receiver id`);
            }
            const message = await this.messageRepository.create(data);
            return MessageDTO.fromEntity(message);
        } catch (error) {
            throw new Error(`Failed to create message: ${error.message}`);
        }
    }

    async updateMessage(id, data) {
        try {
            if (!id || isNaN(id)) {
                throw new Error(`Invalid message id`);
            }
            if (!data || Object.keys(data).length === 0) {
                throw new Error(`No data provided for update`);
            }

            const message = await this.messageRepository.update(id, data);
            return message ? MessageDTO.fromEntity(message) : null;
        } catch (error) {
            throw new Error(`Failed to update message: ${error.message}`);
        }
    }

    async listMessages() {
        try {
            const messages = await this.messageRepository.findAll();
            return messages.map(message => MessageDTO.fromEntity(message));
        } catch (error) {
            throw new Error(`Failed to list messages: ${error.message}`);
        }
    }

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

}
