/**
 * The FriendRepository class contains methods to perform CRUD operations on
 * the friends table.
 * Database automatically handles changes to user data (updating or deleting a user)
 */

import { pool } from "../../config/db.js"
import { Friend } from "../entities/Friend.js"
import { FriendWithDetailsDTO } from "../dto/FriendWithDetailsDTO.js"

export class FriendRepository {

    /**
     * Adds two users as friends
     * NOTE: user1Id must be smaller than user2Id to respect database rules
     * @param {Friend} param0 
     * @returns Friend
     */
    async create({ user1Id, user2Id }) {
        // Ensure user1Id < user2Id
        if (user1Id > user2Id) {
            let temp = user1Id;
            user1Id = user2Id;
            user2Id = temp;
        }

        const sql = `INSERT INTO friends (user1_id, user2_id)
        VALUES ($1, $2)
        RETURNING id, user1_id, user2_id, date_added;`;

        const { rows } = await pool.query(sql, [user1Id, user2Id]);
        return new Friend(rows[0]);
    }

    /**
     * Updates data of a friend row
     * NOTE: user1Id must be smaller than user2Id to respect database rules
     * 
     * @param {int} id
     * @param {Friend} param1
     * @returns Friend if id and param1 arguments are valid, null otherwise
     */
    async update(id, { user1Id, user2Id }) {
        // Ensure user1Id < user2Id
        if (user1Id > user2Id) {
            let temp = user1Id;
            user1Id = user2Id;
            user2Id = temp;
        }

        const sql = `UPDATE friends SET user1_id = $1, user2_id = $2
        WHERE id = $3
        RETURNING id, user1_id, user2_id, date_added;`;

        const { rows } = await pool.query(sql, [user1Id, user2Id, id]);
        return rows[0] ? new Friend(rows[0]) : null;
    }

    /**
     * Lists all friends
     * @returns List<Friend>
     */
    async findAll() {
        const sql = `SELECT id, user1_id, user2_id, date_added
        FROM friends ORDER BY id DESC;`;

        const { rows } = await pool.query(sql);

        return rows.map(row => new Friend(row));
    }

    /**
     * Finds a friend row using id
     * @param {int} id
     * @returns Friend if id is valid, null otherwise
     */
    async findById(id) {
        const sql = `SELECT id, user1_id, user2_id, date_added
        FROM friends WHERE id = $1;`;

        const { rows } = await pool.query(sql, [id]);

        return rows[0] ? new Friend(rows[0]) : null;
    }

    /**
     * Deletes a friend row using id
     * @param {int} id
     * @returns int
    */
    async delete(id) {
        const sql = `DELETE FROM friends WHERE id = $1;`;

        const { rowCount } = await pool.query(sql, [id]);
        return rowCount > 0;
    }

    /**
     * Lists all friends with details about each user
     * @returns List<FriendWithDetailsDTO>
     */
    async findAllWithDetails() {
        // replace each id in friends table with information about the user it refers to
        const sql = `SELECT f.id, f.date_added,
    
            u1.id AS user1_id, u1.username AS user1_username,
            u1.first_name AS user1_first_name, u1.last_name AS user1_last_name,
            u1.email AS user1_email, u1.password AS user1_password,
            u1.created_at AS user1_created_at,
    
            u2.id AS user2_id, u2.username AS user2_username,
            u2.first_name AS user2_first_name, u2.last_name AS user2_last_name,
            u2.email AS user2_email, u2.password AS user2_password,
            u2.created_at AS user2_created_at
    
            FROM friends AS f
                INNER JOIN users AS u1 ON u1.id = f.user1_id
                INNER JOIN users AS u2 ON u2.id = f.user2_id
            ORDER BY id ASC;`;

        const { rows } = await pool.query(sql);

        return rows.map(row => new FriendWithDetailsDTO(row));
    }

    async areFriends(user1Id, user2Id) {
        // Ensure user1Id < user2Id
        if (user1Id > user2Id) {
            let temp = user1Id;
            user1Id = user2Id;
            user2Id = temp;
        }

        const sql = `SELECT id, user1_id, user2_id, date_added
        FROM friends WHERE user1_id = $1 AND user2_id = $2;`;

        const { rowCount } = await pool.query(sql, [user1Id, user2Id]);
        return rowCount > 0;
    }
}
