/**
 * The MessageRepository class contains methods to perform CRUD operations on
 * the users table
 */
import { pool } from "../../config/db.js";
import { Message } from "../entities/Message.js";

export class MessageRepository {

    /**
     * Creates a message
     * @param {Object} messageInfo
     * @returns Message
     */
    async create({ content, senderId, receiverId }) {
        // sent_at is set to NOW() automatically on creation,
        // edited_at is null since we just created the message
        const sql = `INSERT INTO messages (content, sender_id, receiver_id)
        VALUES ($1, $2, $3)
        RETURNING id, content, sender_id, receiver_id, sent_at, edited_at;`;

        const { rows } = await pool.query(sql, [content, senderId, receiverId]);
        return new Message(rows[0]);
    }

    /**
     * Updates data of a message
     * @param {int} id 
     * @param {Object} messageInfo 
     * @returns Message if id and param1 are valid, null otherwise
     */
    async update(id, { content, senderId, receiverId }) {
        const sql = `UPDATE messages SET content = $1, sender_id = $2,
        receiver_id = $3, edited_at = NOW() WHERE id = $4
        RETURNING id, content, sender_id, receiver_id, sent_at, edited_at;`;

        const { rows } = await pool.query(sql, [content, senderId, receiverId, id]);
        return rows[0] ? new Message(rows[0]) : null;
    }

    /**
     * Lists all messages
     * @returns List<Message>
     */
    async findAll() {
        const sql = `SELECT id, content, sender_id, receiver_id, sent_at, edited_at
        FROM messages ORDER BY sent_at;`; // Ordered chronoligically

        const { rows } = await pool.query(sql);
        return rows.map(row => new Message(row));
    }

    /**
     * Finds a message using its id
     * @param {int} id 
     * @returns Message if id is valid, null otherwise
     */
    async findById(id) {
        const sql = `SELECT id, content, sender_id, receiver_id, sent_at, edited_at
        FROM messages WHERE id = $1;`;

        const { rows } = await pool.query(sql, [id]);
        return rows[0] ? new Message(rows[0]) : null;
    }

    /**
     * Deletes a message using its id
     * @param {int} id 
     * @returns int
     */
    async delete(id) {
        const sql = `DELETE FROM messages WHERE id = $1;`;

        const { rowCount } = await pool.query(sql, [id]);
        return rowCount > 0;
    }

    /**
     * Modifies message content
     * @param {int} id 
     * @param {string} content 
     * @returns Message if id and content are valid, null otherwise
     */
    async editContent(id, { content }) {
        const sql = `UPDATE messages SET content = $1, edited_at = NOW() 
        WHERE id = $2
        RETURNING id, content, sender_id, receiver_id, sent_at, edited_at;`;

        const { rows } = await pool.query(sql, [content, id]);
        return rows[0] ? new Message(rows[0]) : null;
    }

    /**
     * Lists all messages between 2 users
     * @param {int} user1Id 
     * @param {int} user2Id 
     * @returns List<Message> if conversation exists, null otherwise
     */
    async findConversation(user1Id, { user2Id }) {
        const sql = `SELECT id, content, sender_id, receiver_id, sent_at, edited_at
        FROM messages 
        WHERE (sender_id = $1 AND receiver_id = $2)
        OR (sender_id = $2 AND receiver_id = $1)
        ORDER BY sent_at;`;

        const { rows } = await pool.query(sql, [user1Id, user2Id]);
        return rows ? rows.map(row => new Message(row)) : null;
    }

    /**
     * Lists all messages in a conversation between 2 users that contain a specific string
     * @param {int} user1Id 
     * @param {Object} information 
     * @returns List<Message> if conversation between users exist and contains content, null otherwise
     */
    async searchInConversation(user1Id, { user2Id, content }) {
        const sql = `SELECT id, content, sender_id, receiver_id, sent_at, edited_at
        FROM messages 
        WHERE ((sender_id = $1 AND receiver_id = $2)
        OR (sender_id = $2 AND receiver_id = $1))
        AND content LIKE $3
        ORDER BY sent_at;`;

        const { rows } = await pool.query(sql, [user1Id, user2Id, `%${content}%`]);

        return rows ? rows.map(row => new Message(row)) : null;
    }
}
