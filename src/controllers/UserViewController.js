/**
 * Controller for User views
 */
import { validationResult } from "express-validator";

export class UserViewController {
    /**
     * Constructs a UserController object
     * @param {UserService} userService 
     */
    constructor(userService, friendService) {
        this.userService = userService;
        this.friendService = friendService; // to check friend state between 2 users in search
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
                notification: null,
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

            // Go back to about page with success message
            const user = await this.userService.getUserById(req.user.id);

            res.render('users/about', {
                user: user,
                notification: "Email changed successfully",
            });
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

            // Go back to about page with success message
            const user = await this.userService.getUserById(req.user.id);

            res.render('users/about', {
                user: user,
                notification: "Password changed successfully",
            });
        } catch (error) {
            res.render('users/changePassword', {
                error: error.message,
            });
        }
    }

    getSearchPage = async (req, res, next) => {
        try {
            res.render('users/search', {
                user: null,
                error: null,
            });
        } catch (error) {
            // next(error);
            res.render('users/search', {
                user: null,
                error: error.message,
            });
        }
    }

    searchForUser = async (req, res, next) => {
        try {
            if (this._validate(req, res, 'users/search')) {
                return;
            }

            const user = await this.userService.getUserByUsername(req.body.username);
            if (!user) {
                return res.render('users/search', {
                    user: user,
                    error: `Could not find ${req.body.username}`,
                });
            }

            if (user.id === req.user.id) {
                return res.render('users/search', {
                    user: null,
                    error: "That's you!",
                });
            }
            // Check current friendship status to display appropriate options (blocked, accepted, pending, or not a friend)
            const friendRow = await this.friendService.findFriendIdByUserIds(user.id, req.user.id);

            if (friendRow == null) { // no friend request
                res.render('users/search', {
                    user: user,
                    error: null,
                    friendState: null
                });
            }
            else {
                res.render('users/search', {
                    user: user,
                    error: null,
                    friendState: friendRow.state,
                });
            }
        } catch (error) {
            res.render('users/search', {
                user: null,
                error: error.message,
            });
        }
    }
}
