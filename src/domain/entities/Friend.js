/**
 * Class used to represent a friend
 */
export class Friend {
    constructor({ id = null, user1_id, user2_id, date_added = null }) {
        this.id = id;
        this.user1Id = user1_id;
        this.user2Id = user2_id;
        this.dateAdded = date_added;
    }
}
