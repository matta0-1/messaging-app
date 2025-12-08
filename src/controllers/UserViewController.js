/**
 * Controller for User views
 */
import { validationResult } from "express-validator";

export class UserViewController {
    /**
     * Constructs a UserController object
     * @param {UserService} userService 
     */
    constructor(userService) {
        this.userService = userService;
    }

    _validate(req, res, viewName) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).render(viewName, {
                error: errors.array()[0].msg,
            });
            return true;
        }
        return false;
    }

    getHomePage = async (req, res, next) => {
        try {
            res.render('users/home', {
                user: req.user,
            });
        } catch (error) {
            next(error);
        }
    }

    getFriendsPage = async (req, res, next) => {
        try {
            const acceptedFriends = await this.userService.listFriendsById(req.user.id);
            const pendingFriends = await this.userService.listPendingFriendsById(req.user.id);
            const blockedFriends = await this.userService.listBlockedFriendsById(req.user.id);

            res.render('friends/list', {
                user: req.user,
                acceptedFriends: acceptedFriends,
                pendingFriends: pendingFriends,
                blockedFriends: blockedFriends,
            });

        } catch (error) {
            next(error);
        }
    }

    getAboutPage = async (req, res, next) => {
        try {
            const user = await this.userService.getUserById(req.user.id);

            res.render('users/about', {
                user: user,
            });
        } catch (error) {
            next(error);
        }
    }

    getAllUsersPage = async (req, res, next) => {
        try {
            // Get all users
            let users = await this.userService.listUsers();

            // remove self
            users = users.filter(user => user.id !== req.user.id);

            // remove users who have a friend request with user who entered the page
            const acceptedFriends = await this.userService.listFriendsById(req.user.id);
            const pendingFriends = await this.userService.listPendingFriendsById(req.user.id);
            const blockedFriends = await this.userService.listBlockedFriendsById(req.user.id);

            if (acceptedFriends !== null && users !== null) {
                users = users.filter(user => !acceptedFriends.filter(friend => friend.id === user.id).length);
            }
            if (pendingFriends !== null && users !== null) {
                users = users.filter(user => !pendingFriends.filter(friend => friend.id === user.id).length);
            }
            if (blockedFriends !== null && users !== null) {
                users = users.filter(user => !blockedFriends.filter(friend => friend.id === user.id).length);
            }

            res.render('users/list', {
                users: users,
            });
        } catch (error) {
            next(error);
        }
    }


    deleteAccount = async (req, res, next) => {
        try {
            if (this._validate(req, res, 'about')) {
                return;
            }

            const ok = await this.userService.deleteUser(req.user.id);
            if (!ok) {
                return res.status(404).json('Not found');
            }

            res.clearCookie('token');
            return res.redirect('/auth/logout'); // to delete cookies
        } catch (e) {
            next(e);
        }
    }


    getChangeEmailPage = async (req, res, next) => {
        try {
            res.render('users/changeEmail', {
                error: null,
            });
        } catch (error) {
            // next(error);
            res.render('users/changeEmail', {
                error: error.message,
            });
        }
    }

    getChangePasswordPage = async (req, res, next) => {
        try {
            res.render('users/changePassword', {
                error: null,
            });
        } catch (error) {
            // next(error);
            res.render('users/changePassword', {
                error: error.message,
            });
        }
    }

    changeEmail = async (req, res, next) => {
        try {
            if (this._validate(req, res, 'users/changeEmail')) {
                return;
            }

            const ok = await this.userService.updateUserEmail(req.user.id, req.body.email);
            if (!ok) {
                return res.render('users/changeEmail', {
                    error: "Unexpected error",
                });
            }

            return res.redirect('/users/about');
        } catch (error) {
            res.render('users/changeEmail', {
                error: error.message,
            });
        }
    }

    changePassword = async (req, res, next) => {
        try {
            if (this._validate(req, res, 'users/changePassword')) {
                return;
            }

            const ok = await this.userService.updateUserPassword(req.user.id, req.body.oldPassword, req.body.newPassword);
            if (!ok) {
                return res.render('users/changePassword', {
                    error: "Unexpected error",
                });
            }

            return res.redirect('/users/about');
        } catch (error) {
            res.render('users/changePassword', {
                error: error.message,
            });
        }
    }
}
