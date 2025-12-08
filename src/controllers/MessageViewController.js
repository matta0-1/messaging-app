/**
 * Controller for Message views
 */
import { validationResult } from "express-validator";

export class MessageViewController {
    /**
     * Constructs a MessageController object
     * @param {MessageService} messageService 
     */
    constructor(messageService, userService) {
        this.messageService = messageService;
        this.userService = userService; // for getting info of other user in conversation
    }

    _validate(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        return null;
    }

    getConversationPage = async (req, res, next) => {
        try {
            if (this._validate(req, res)) {
                return;
            }
            const data = { user2Id: req.user.id }; // needed because listConversation takes second parameter as an object
            const messages = await this.messageService.listConversation(req.params.id, data);

            // get data of req.params.id (username) to display it on top of the page
            const user2 = await this.userService.getUserById(req.params.id);

            res.render('messages/conversation', {
                messages: messages,
                user1Id: req.user.id,
                user2: user2,
            });
        } catch (error) {
            next(error);
        }
    }

    sendMessage = async (req, res, next) => {
        try {
            if (this._validate(req, res)) {
                return;
            }

            const data = {
                content: req.body.content,
                senderId: req.user.id,
                receiverId: req.params.id,
            }
            await this.messageService.createMessage(data);
            return res.redirect(`/messages/${req.params.id}`);
        } catch (error) {
            next(error);
        }
    }

    editContent = async (req, res, next) => {
        try {
            if (this._validate(req, res)) {
                return;
            }

            // req.params.id is the message id
            // req.body contains content
            const data = await this.messageService.editMessage(req.params.id, req.body);
            if (!data) {
                console.log("ERRORRRRR")
                return res.status(404).json({ message: "Not found" });
            }
            // NOT req.params.id, we need to get the other user's id
            return res.redirect(`/messages/${req.body.user2Id}`);
        } catch (error) {
            next(error);
        }
    }
}
