/**
 * The UserService class contains methods to perform user-related actions
 */

import { UserDTO } from "../domain/dto/UserDTO.js";

export class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Lists all users
     * @returns List<Users>
     */
    async listUsers() {
        try {
            const users = await this.userRepository.findAll();
            // console.log(`FROM SERVICES:`);
            // console.log(users);
            return users.map(user => UserDTO.fromEntity(user)); // CHECK FOR POTENTIAL ERROR (different parameters)
        } catch (error) {
            throw new Error(`Failed to list users: ${error.message}`);
        }
    }

    /**
     * Finds user by id
     * @param {int} id 
     * @returns UserDTO
     */
    async getUserById(id) {
        try {
            if (!id || isNaN(id)) {
                throw new Error('Invalid User ID');
            }
            const user = await this.userRepository.findById(id);
            if (!user) {
                return null;
            }
            return UserDTO.fromEntity(user);
        } catch (error) {
            throw new Error(`Failed to get user: ${error.message}`);
        }
    }

    /**
     * Finds user by username
     * @param {int} id 
     * @returns UserDTO
     */
    async getUserByUsername(username) {
        try {
            if (!username) {
                throw new Error('Invalid Username');
            }
            const user = await this.userRepository.findByUsername(username);
            if (!user) {
                return null;
            }
            return UserDTO.fromEntity(user);
        } catch (error) {
            throw new Error(`Failed to get user: ${error.message}`);
        }
    }

    /**
     * Creates user
     * @param {User} data 
     * @returns User
     */
    async createUser(data) {
        try {
            if (!data || !data.username || !data.firstName || !data.lastName
                || !data.email || !data.password) {
                throw new Error('Missing required fields: username, first name, last name, email address, password');
            }
            const user = this.userRepository.create(data);
            return UserDTO.fromEntity(user);
        } catch (error) {
            throw new Error(`Failed to create user: ${error.message}`);
        }
    }

    /**
     * Updates data of a user
     * @param {int} id 
     * @param {User} data 
     * @returns 
     */
    async updateUser(id, data) {
        try {
            if (!id || isNaN(id)) {
                throw new Error('Invalid User ID');
            }
            if (!data || Object.keys(data).length === 0) {
                throw new Error('No data provided for update');
            }
            const user = this.userRepository.update(id, data);
            return user ? UserDTO.fromEntity(user) : null;
        } catch (error) {
            throw new Error(`Failed to update user: ${error.message}`);
        }
    }

    /**
     * Deletes user by id
     * @param {int} id 
     * @returns int
     */
    async deleteUserByID(id) {
        try {
            if (!id || isNaN(id)) {
                throw new Error('Invalid User ID');
            }
            return await this.userRepository.deleteById(id);
        } catch (error) {
            throw new Error(`Failed to delete user: ${error.message}`);
        }
    }

    /**
     * Deletes user by username
     * @param {string} username 
     * @returns int
     */
    async deleteUserByUsername(username) {
        try {
            if (!username) {
                throw new Error('Invalid Username');
            }
            return await this.userRepository.deleteByUsername(username);
        } catch (error) {
            throw new Error(`Failed to delete user: ${error.message}`);
        }
    }
}
