/**
 * Controller for Friend
 */
import { validationResult } from "express-validator";

export class FriendViewController {
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

    delete = async (req, res, next) => {
        try {
            if (this._validate(req, res)) {
                return;
            }
            const friendRow = await this.friendService.findFriendIdByUserIds(req.user.id, req.params.id);
            const ok = await this.friendService.deleteFriend(friendRow.id);
            if (!ok) {
                return res.status(404).json({ message: 'Not found' });
            }

            return res.redirect('/users/friends');

        } catch (e) {
            next(e);
        }
    }

    accept = async (req, res, next) => {
        try {
            if (this._validate(req, res)) {
                return;
            }
            const friendRow = await this.friendService.findFriendIdByUserIds(req.user.id, req.params.id);
            const data = await this.friendService.acceptFriendRequest(friendRow.id);
            if (!data) {
                return res.status(404).json({ message: 'No data found' });
            }
            return res.redirect('/users/friends');
        } catch (e) {
            next(e);
        }
    }

    block = async (req, res, next) => {
        try {
            if (this._validate(req, res)) {
                return;
            }
            const friendRow = await this.friendService.findFriendIdByUserIds(req.user.id, req.params.id);
            const data = await this.friendService.blockFriendRequest(friendRow.id);
            if (!data) {
                return res.status(404).json({ message: 'No data found' });
            }

            return res.redirect('/users/friends');
        } catch (e) {
            next(e);
        }
    }
}
