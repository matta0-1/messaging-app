/**
 * Data Transfer Object for detailed information about two friends.
 * Contains data of friends table and data about the two users referenced
 * by user1_id and user2_id
 */
export class FriendWithDetailsDTO {
    constructor({ id, date_added,
        user1_id, user1_username, user1_first_name, user1_last_name,
        user1_email, // user1_password,
        user1_created_at,
        user2_id, user2_username, user2_first_name, user2_last_name,
        user2_email, // user2_password, 
        user2_created_at }) {

        this.id = id;
        this.date_added = date_added;

        this.user1_id = user1_id;
        this.user1_username = user1_username;
        this.user1_first_name = user1_first_name;
        this.user1_last_name = user1_last_name;
        this.user1_email = user1_email;
        // this.user1_password = user1_password;
        this.user1_created_at = user1_created_at;

        this.user2_id = user2_id;
        this.user2_username = user2_username;
        this.user2_first_name = user2_first_name;
        this.user2_last_name = user2_last_name;
        this.user2_email = user2_email;
        // this.user2_password = user2_password;
        this.user2_created_at = user2_created_at;
    }

    // mapper to convert entity to DTO
    static fromEntity(entity) {
        return new FriendWithDetailsDTO(entity);
    }
}
