/**
 * Controller for Message
 */
import { validationResult } from "express-validator";

export class MessageController {
    /**
     * Constructs a MessageController object
     * @param {MessageService} messageService 
     */
    constructor(messageService) {
        this.messageService = messageService;
    }

    _validate(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        return null;
    }

    create = async (req, res, next) => {
        try {
            if (this._validate(req, res)) {
                return;
            }

            const data = await this.messageService.createMessage(req.body);
            console.log(data)
            res.status(201).json(data);
        } catch (error) {
            next(error);
        }
    }

    update = async (req, res, next) => {
        try {
            if (this._validate(req, res)) {
                return;
            }
            const data = await this.messageService.updateMessage(req.params.id, req.body);
            if (!data) {
                return res.status(404).json({ message: 'Not found' });
            }

            res.status(201).json(data);
        } catch (error) {
            next(error);
        }
    }

    list = async (req, res, next) => {
        try {
            res.json(await this.messageService.listMessages());
        } catch (error) {
            next(error);
        }
    }

    get = async (req, res, next) => {
        try {
            if (this._validate(req, res)) {
                return;
            }
            const data = await this.messageService.getMessageById(req.params.id);
            if (!data) {
                return res.status(404).json({ message: 'Not found' });
            }
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    delete = async (req, res, next) => {
        try {
            if (this._validate(req, res)) {
                return;
            }
            const ok = await this.messageService.deleteMessage(req.params.id);
            if (!ok) {
                return res.status(404).json({ message: 'Not found' });
            }
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    editContent = async (req, res, next) => {
        try {
            if (this._validate(req, res)) {
                return;
            }

            const data = await this.messageService.editMessage(req.params.id, req.body);
            if (!data) {
                return res.status(404).json({ message: "Not found" });
            }
            res.status(201).json(data);
        } catch (error) {
            next(error);
        }
    }

    getConversation = async (req, res, next) => {
        try {
            if (this._validate(req, res)) {
                return;
            }
            const data = await this.messageService.listConversation(req.params.id, req.body);
            if (!data) {
                return res.status(404).json({ message: `No conversation between users ${req.params.id} and ${req.body.user2Id}` });
            }
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    getMessagesWithContentInConversation = async (req, res, next) => {
        try {
            if (this._validate(req, res)) {
                return;
            }
            const data = await this.messageService.searchInConversation(req.params.id, req.body);
            if (!data) {
                return res.status(404).json({ message: `No messages with ${req.body.content} In conversation between users ${req.params.id} and ${req.body.user2Id}` });
            }
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }
}
