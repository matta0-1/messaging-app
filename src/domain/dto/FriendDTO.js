/**
 * Data Transfer Object for Friend
 */

export class FriendDTO {
    constructor({ id = null, user1Id, user2Id, dateAdded }) {
        this.id = id;
        this.user1Id = user1Id;
        this.user2Id = user2Id;
        this.dateAdded = dateAdded;
    }

    // mapper to convert entity to a DTO
    static fromEntity(entity) {
        return new FriendDTO(entity);
    }
}
