/**
 * The UserRepository class contains methods to perform CRUD operations on
 * the users table
 */

import { pool } from "../../config/db.js";
import { User } from "../entities/User.js";

export class UserRepository {
    /**
     * Creates a user
     * @param {User} param0
     * @returns User
     */
    async create({ username, firstName, lastName, email, password }) {
        const sql = `INSERT INTO users (username, first_name, last_name, email, password)
        VALUES (LOWER($1), $2, $3, $4, $5)
        RETURNING id, username, first_name, last_name, email, password, created_at;
        `;
        const { rows } = await pool.query(sql, [username, firstName, lastName, email, password]);
        return new User(rows[0]);
    }

    /**
     * Updates data of a user
     * @param {int} id
     * @param {User} param1
     * @returns User if id and param1 arguments are valid, null otherwise
     */
    async update(id, { username, firstName, lastName, email, password }) {
        const sql = `UPDATE users SET username = LOWER($1), first_name = $2, last_name = $3,
        email = $4, password = $5 WHERE id = $6
        RETURNING id, username, first_name, last_name, email, password, created_at;
        `;
        const { rows } = await pool.query(sql, [username, firstName, lastName, email, password, id]);

        return rows[0] ? new User(rows[0]) : null;
    }

    /**
     * Lists all users
     * @returns List<User>
     */
    async findAll() {
        const sql = `SELECT id, username, first_name, last_name, email, password, created_at
        FROM users ORDER BY id DESC;`;

        // let rows = await pool.query(sql);
        // rows = rows.rows;
        const { rows } = await pool.query(sql);
        return rows.map(row => new User(row));
    }

    /**
     * Finds a user using his id
     * @param {int} id
     * @returns User if id is valid, null otherwise
     */
    async findById(id) {
        const sql = `SELECT id, username, first_name, last_name, email, password, created_at
        FROM users WHERE id = $1;`

        const { rows } = await pool.query(sql, [id]);
        return rows[0] ? new User(rows[0]) : null;
    }

    /**
     * Finds a user using his username
     * @param {string} username
     * @returns User if username is valid, null otherwise
     */
    async findByUsername(username) {
        const sql = `SELECT id, username, first_name, last_name, email, password, created_at
        FROM users WHERE username = LOWER($1);`

        const { rows } = await pool.query(sql, [username]);
        return rows[0] ? new User(rows[0]) : null;
    }

    /**
     * Deletes a user using his id
     * @param {int} id
     * @returns int
     */
    async delete(id) {
        const { rowCount } = await pool.query(`DELETE FROM users WHERE id = $1;`, [id]);
        return rowCount > 0;
    }

    /**
     * Lists all friends of the user with the given id
     * @param {int} id 
     * @returns List<User> if successful, null otherwise
    */
    async findFriendsById(id) {
        const sql = `SELECT id, username, first_name, last_name, email,
            password, created_at FROM users WHERE id IN
                (SELECT user1_id AS user_id FROM friends WHERE user2_id = $1
                UNION
                SELECT user2_id AS user_id FROM friends WHERE user1_id = $1)
            ORDER BY id ASC;`;

        const { rows } = await pool.query(sql, [id]);

        // Return users if available, null otherwise
        return rows[0] ? rows.map(row => new User(row)) : null;
    }

    /**
     * Lists all friends of the user with the given username
     * @param {string} username 
     * @returns List<User> if successful, null otherwise
    */
    async findFriendsByUsername(username) {
        // Retrieve userId from username then run the same query
        const sql = `SELECT id, username, first_name, last_name, email,
            password, created_at FROM users WHERE id IN
                (
                SELECT user1_id AS user_id FROM friends WHERE user2_id = 
                    (SELECT id FROM users WHERE username = $1)
                UNION
                SELECT user2_id AS user_id FROM friends WHERE user1_id =
                    (SELECT id FROM users WHERE username = $1)
                )
            ORDER BY id ASC;`;

        const { rows } = await pool.query(sql, [username]);

        // Return users if available, null otherwise
        return rows[0] ? rows.map(row => new User(row)) : null;
    }
}
