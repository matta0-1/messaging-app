import { pool } from "../../config/db.js";
import { Message } from "../entities/Message.js";

export class MessageRepository {

    async create({ content, senderId, receiverId }) {
        // sent_at is set to NOW() automatically on creation,
        // edited_at is null since we just created the message
        const sql = `INSERT INTO messages (content, sender_id, receiver_id)
        VALUES ($1, $2, $3)
        RETURNING id, content, sender_id, receiver_id, sent_at, edited_at;`;

        const { rows } = await pool.query(sql, [content, senderId, receiverId]);
        return new Message(rows[0]);
    }

    async update(id, { content, senderId, receiverId }) {
        const sql = `UPDATE messages SET content = $1, sender_id = $2,
        receiver_id = $3, edited_at = NOW() WHERE id = $4
        RETURNING id, content, sender_id, receiver_id, sent_at, edited_at;`;

        const { rows } = await pool.query(sql, [content, senderId, receiverId, id]);
        return rows[0] ? new Message(rows[0]) : null;
    }

    async findAll() {
        const sql = `SELECT id, content, sender_id, receiver_id, sent_at, edited_at
        FROM messages ORDER BY sent_at DESC;`; // Ordered chronoligically

        const { rows } = await pool.query(sql);
        return rows.map(row => new Message(row));
    }

    async findById(id) {
        const sql = `SELECT id, content, sender_id, receiver_id, sent_at, edited_at
        FROM messages WHERE id = $1;`;

        const { rows } = await pool.query(sql, [id]);
        return rows[0] ? new Message(rows[0]) : null;
    }

    async delete(id) {
        const sql = `DELETE FROM messages WHERE id = $1;`;

        const { rowCount } = await pool.query(sql, [id]);
        return rowCount > 0;
    }

/////////////////////////////////////////////////////////////////////////////////

    async editContent(id, { content }) {
        const sql = `UPDATE messages SET content = $1, edited_at = NOW() 
        WHERE id = $2
        RETURNING id, content, sender_id, receiver_id, sent_at, edited_at;`;

        const { rows } = await pool.query(sql, [content, id]);
        return rows[0] ? new Message(rows[0]) : null;
    }
}
