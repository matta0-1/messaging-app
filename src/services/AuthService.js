import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }


    async login(username, password) {
        try {
            const user = await this.userRepository.findByUsernameGettingPassword(username);
            if (!user) { // username not found 
                throw new Error("Username not found");
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                throw new Error("Invalid password"); // bad error message (for development only)
            }

            const token = jwt.sign(
                { id: user.id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            return { token, user: { id: user.id, username: user.username } };
        } catch (error) {
            throw new Error(`Could not log you in: ${error.message}`);
        }
    }


    async signup(data) { // NOTE: almost same as UserService.js
        try {
            if (!data || !data.username || !data.firstName || !data.lastName
                || !data.email || !data.password) {
                throw new Error('Missing required fields: username, first name, last name, email address, password');
            }
            const user = await this.userRepository.create(data);

            const token = jwt.sign(
                { id: user.id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            return { token, user: { id: user.id, username: user.username } };

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
}
