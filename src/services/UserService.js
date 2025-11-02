/**
 * The UserService class contains methods to perform user-related actions
 */

import { UserDTO } from "../domain/dto/UserDTO.js";

export class UserService {
    /**
     * Constructs a UserService object
     * @param {UserRepository} userRepository 
     */
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Lists all users
     * @returns List<User>
     */
    async listUsers() {
        try {
            const users = await this.userRepository.findAll();
            return users.map(user => UserDTO.fromEntity(user)); // CHECK FOR POTENTIAL ERROR (different parameters)
        } catch (error) {
            throw new Error(`Failed to list users: ${error.message}`);
        }
    }

    /**
     * Finds user by id
     * @param {int} id 
     * @returns UserDTO if successful, null otherwise
     */
    async getUserById(id) {
        try {
            if (!id || isNaN(id)) {
                throw new Error('Invalid User id');
            }
            const user = await this.userRepository.findById(id);
            // if (!user) {
            //     return null;
            // }
            return user ? UserDTO.fromEntity(user) : null;
        } catch (error) {
            throw new Error(`Failed to get user: ${error.message}`);
        }
    }

    /**
     * Finds user by username
     * @param {string} username 
     * @returns UserDTO if successful, null otherwise
     */
    async getUserByUsername(username) {
        try {
            if (!username) {
                throw new Error('Invalid username');
            }
            const user = await this.userRepository.findByUsername(username);
            // if (!user) {
            //     return null;
            // }
            return user ? UserDTO.fromEntity(user) : null;
        } catch (error) {
            throw new Error(`Failed to get user: ${error.message}`);
        }
    }

    /**
     * Creates a user
     * @param {User} data 
     * @returns UserDTO
     */
    async createUser(data) {
        try {
            if (!data || !data.username || !data.firstName || !data.lastName
                || !data.email || !data.password) {
                throw new Error('Missing required fields: username, first name, last name, email address, password');
            }
            const user = await this.userRepository.create(data);
            return UserDTO.fromEntity(user);
        } catch (error) {
            let message = "";
            if (error.message == 'duplicate key value violates unique constraint \"users_username_key\"') {
                message = "This username is already taken. Try another one";
            } else {
                message = error.message;
            }
            throw new Error(`Failed to create user: ${message}`);
        }
    }

    /**
     * Updates data of a user
     * @param {int} id 
     * @param {User} data 
     * @returns UserDTO if successful, null otherwise
     */
    async updateUser(id, data) {
        try {
            if (!id || isNaN(id)) {
                throw new Error('Invalid User id');
            }
            if (!data || Object.keys(data).length === 0) {
                throw new Error('No data provided for update');
            }
            const user = await this.userRepository.update(id, data);
            return user ? UserDTO.fromEntity(user) : null;
        } catch (error) {
            let message = "";
            if (error.message == 'duplicate key value violates unique constraint \"users_username_key\"') {
                message = "This username is already taken. Try another one";
            } else {
                message = error.message;
            }
            throw new Error(`Failed to update user: ${message}`);
        }
    }

    /**
     * Deletes user by id
     * @param {int} id 
     * @returns int
     */
    async deleteUser(id) {
        try {
            if (!id || isNaN(id)) {
                throw new Error('Invalid User id');
            }
            return await this.userRepository.delete(id);
        } catch (error) {
            throw new Error(`Failed to delete user: ${error.message}`);
        }
    }

    /**
     * Lists all friends of a user
     * @param {int} id
     * @returns List<UserDTO>
     */
    async listFriends(id) {
        try {
            const users = await this.userRepository.findFriendsOf(id);
            return users ? users.map(user => UserDTO.fromEntity(user)) : null;
        } catch (error) {
            throw new Error(`Failed to list friends of user with id ${id}`);
        }
    }
}
