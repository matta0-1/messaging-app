/**
 * DTO for Message
 */
export class MessageDTO {
    constructor({ id = null, content, senderId, receiverId, sentAt = null, editedAt = null }) {
        this.id = id;
        this.content = content;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.sentAt = sentAt;
        this.editedAt = editedAt;
    }

    // mapper to convert entity to a DTO
    static fromEntity(entity) {
        return new MessageDTO(entity);
    }
}
