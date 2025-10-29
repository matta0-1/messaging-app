export class Message {
    constructor({ id = null, content, sender_id, receiver_id, sent_at = null, edited_at = null }) {
        this.id = id;
        this.content = content;
        this.senderId = sender_id;
        this.receiverId = receiver_id;
        this.sentAt = sent_at;
        this.editedAt = edited_at;
    }
}
