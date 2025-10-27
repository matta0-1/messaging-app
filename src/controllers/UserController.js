import { validationResult } from "express-validator";

export class UserController {
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

    get = async (req, res, next) => {
        try {
            if (this._validate(req, res)) { // if not null --> there are errors
                return;
            }
            const data = await this.userService.getUserById(req.params.id);
            if (!data) {
                return res.status(404).json({ message: 'Not Found' });
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
}
