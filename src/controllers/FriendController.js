/**
 * Controller for Friend
 */
import { validationResult } from "express-validator";

export class FriendController {
    /**
     * Constructs a FriendController object
     * @param {FriendService} friendService
     */
    constructor(friendService) {
        this.friendService = friendService;
    }

    _validate(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        return null;
    }

    list = async (req, res, next) => {
        try {
            res.json(await this.friendService.listFriends());
        } catch (e) {
            next(e);
        }
    }

    get = async (req, res, next) => {
        try {
            if (this._validate(req, res)) {
                return;
            }
            const data = await this.friendService.getFriendById(req.params.id);
            if (!data) {
                return res.status(404).json({ message: 'Not found' })
            }
            res.status(200).json(data);
        } catch (e) {
            next(e);
        }
    }

    create = async (req, res, next) => {
        try {
            if (this._validate(req, res)) {
                return;
            }
            const data = await this.friendService.createFriend(req.body);
            res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    update = async (req, res, next) => {
        try {
            if (this._validate(req, res)) {
                return;
            }
            const data = await this.friendService.updateFriend(req.params.id, req.body);
            if (!data) {
                return res.status(404).json({ message: 'No data found' });
            }
            res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    delete = async (req, res, next) => {
        try {
            if (this._validate(req, res)) {
                return;
            }
            const ok = await this.friendService.deleteFriend(req.params.id);
            if (!ok) {
                return res.status(404).json({ message: 'Not found' });
            }

            res.status(204).send();
        } catch (e) {
            next(e);
        }
    }

    getAllWithDetails = async (req, res, next) => {
        try {
            if (this._validate(req, res)) {
                return;
            }
            const data = await this.friendService.listFriendsWithDetails();
            if (!data) {
                return res.status(404).json({ message: 'Not Found' });
            }
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    accept = async (req, res, next) => {
        try {
            if (this._validate(req, res)) {
                return;
            }
            const data = await this.friendService.acceptFriendRequest(req.params.id);
            if (!data) {
                return res.status(404).json({ message: 'No data found' });
            }
            res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    block = async (req, res, next) => {
        try {
            if (this._validate(req, res)) {
                return;
            }
            const data = await this.friendService.blockFriendRequest(req.params.id);
            if (!data) {
                return res.status(404).json({ message: 'No data found' });
            }
            res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }
}
