/**
 * Controller for User
 */
import { validationResult } from "express-validator";

export class UserController {
    /**
     * Constructs a UserController object
     * @param {UserService} userService 
     */
    constructor(userService) {
        this.userService = userService;
    }

    _validate(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        return null; // no errors
    }

    list = async (req, res, next) => {
        try {
            res.json(await this.userService.listUsers());
        } catch (e) {
            next(e);
        }
    }

    getById = async (req, res, next) => {
        try {
            if (this._validate(req, res)) { // if not null --> there are errors
                return;
            }
            const data = await this.userService.getUserById(req.params.id);
            if (!data) { // data = null , no user found
                return res.status(404).json({ message: 'Not found' });
            }
            res.status(200).json(data);
        } catch (e) {
            next(e);
        }
    }

    getByUsername = async (req, res, next) => {
        try {
            if (this._validate(req, res)) {
                return;
            }
            const data = await this.userService.getUserByUsername(req.params.username);
            if (!data) {
                return res.status(404).json({ message: 'Not found' });
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

            const data = await this.userService.createUser(req.body);
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

            const data = await this.userService.updateUser(req.params.id, req.body);
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

            const ok = await this.userService.deleteUser(req.params.id);
            if (!ok) {
                return res.status(404).json('Not found');
            }

            res.status(204).send();
        } catch (e) {
            next(e);
        }
    }

    getFriendsById = async (req, res, next) => {
        try {
            if (this._validate(req, res)) {
                return;
            }
            const data = await this.userService.listFriendsById(req.params.id);
            if (!data) {
                return res.status(404).json({ message: `User ${req.params.id} has no friends or does not exist` });
            }
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    getFriendsByUsername = async (req, res, next) => {
        try {
            if (this._validate(req, res)) {
                return;
            }
            const data = await this.userService.listFriendsByUsername(req.params.username);
            if (!data) {
                return res.status(404).json({ message: `User ${req.params.username} has no friends or does not exist` });
            }
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }



    getPendingFriendsById = async (req, res, next) => {
        try {
            if (this._validate(req, res)) {
                return;
            }
            const data = await this.userService.listPendingFriendsById(req.params.id);
            if (!data) {
                return res.status(404).json({ message: `User ${req.params.id} has no pending friend requests or does not exist` });
            }
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    getPendingFriendsByUsername = async (req, res, next) => {
        try {
            if (this._validate(req, res)) {
                return;
            }
            const data = await this.userService.listPendingFriendsByUsername(req.params.username);
            if (!data) {
                return res.status(404).json({ message: `User ${req.params.username} has no pending friend requests or does not exist` });
            }
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }


    getBlockedFriendsById = async (req, res, next) => {
        try {
            if (this._validate(req, res)) {
                return;
            }
            const data = await this.userService.listBlockedFriendsById(req.params.id);
            if (!data) {
                return res.status(404).json({ message: `User ${req.params.id} has no blocked friend requests or does not exist` });
            }
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    getBlockedFriendsByUsername = async (req, res, next) => {
        try {
            if (this._validate(req, res)) {
                return;
            }
            const data = await this.userService.listBlockedFriendsByUsername(req.params.username);
            if (!data) {
                return res.status(404).json({ message: `User ${req.params.username} has no blocked friend requests or does not exist` });
            }
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }
}
