/**
 * The FriendService class contains methods to perform friend-related actions
 */

import { FriendDTO } from "../domain/dto/FriendDTO.js";

export class FriendService {
    /**
     * Construct a FriendService object
     * @param {FriendRepository} friendRepository 
     */
    constructor(friendRepository) {
        this.friendRepository = friendRepository;
    }

    /**
     * Lists all friends
     * @returns List<Friend>
     */
    async listFriends() {
        try {
            const friends = await this.friendRepository.findAll();
            return friends.map(friend => FriendDTO.fromEntity(friend));
        } catch (error) {
            throw new Error(`Failed to list friends: ${error.message}`);
        }
    }

    /**
     * Finds friend by id
     * @param {int} id
     * @returns FriendDTO if successful, null otherwise
     */
    async getFriendById(id) {
        try {
            if (!id || isNaN(id)) {
                throw new Error('Invalid friend id');
            }
            const friend = await this.friendRepository.findById(id);
            // if (!friend) {
            //     return null;
            // }
            return friend ? FriendDTO.fromEntity(friend) : null;
        } catch (error) {
            throw new Error(`Failed to get friend: ${error.message}`);
        }
    }

    /**
     * Creates friend relationship between two users
     * @param {Friend} data 
     * @returns FriendDTO
     */
    async createFriend(data) {
        try {
            if (!data || !data.user1Id || !data.user2Id) {
                throw new Error(`Missing required fields: user 1 id, user 2 id`);
            }
            const friend = await this.friendRepository.create(data);
            return FriendDTO.fromEntity(friend);
        } catch (error) {
            let message = "";
            if (error.message == 'duplicate key value violates unique constraint \"friends_user1_id_user2_id_key\"') {
                message = `Users ${data.user1Id} and ${data.user2Id} are already friends`;
            } else if (error.message == 'insert or update on table \"friends\" violates foreign key constraint \"friends_user2_id_fkey\"') {
                message = "One or both users do not exist";
            } else if (error.message == 'new row for relation \"friends\" violates check constraint \"friends_check\"') {
                message = "Cannot add yourself as a friend";
            } else {
                message = error.message;
            }
            throw new Error(`Failed to create friend: ${message}`);
        }
    }

    /**
     * Updates data of a friend row
     * @param {int} id
     * @param {Friend} data
     * @returns FriendDTO if successful, null otherwise
     */
    async updateFriend(id, data) {
        try {
            if (!id || isNaN(id)) {
                throw new Error(`Invalid Friend ID`);
            }
            if (!data || Object.keys(data).length === 0) {
                throw new Error('No data provided for update');
            }
            const friend = await this.friendRepository.update(id, data);
            return friend ? FriendDTO.fromEntity(friend) : null;
        } catch (error) {
            let message = "";
            if (error.message == 'duplicate key value violates unique constraint \"friends_user1_id_user2_id_key\"') {
                message = `Users ${data.user1Id} and ${data.user2Id} are already friends`;
            } else if (error.message == 'insert or update on table \"friends\" violates foreign key constraint \"friends_user2_id_fkey\"') {
                message = "One or both users do not exist";
            } else if (error.message == 'new row for relation \"friends\" violates check constraint \"friends_check\"') {
                message = "Cannot add yourself as a friend";
            } else {
                message = error.message;
            }
            throw new Error(`Failed to update friend: ${message}`);
        }
    }


    /**
     * Deletes friend by id
     * @param {int} id 
     * @returns int
     */
    async deleteFriend(id) {
        try {
            if (!id || isNaN(id)) {
                throw new Error('Invalid friend ID');
            }
            return await this.friendRepository.delete(id);
        } catch (error) {
            throw new Error(`Failed to delete friend: ${error.message}`);
        }
    }

    /**
     * Lists all friends with details of each user
     * @returns List<FriendWithDetailsDTO>
     */
    async listFriendsWithDetails() {
        try {
            const friendsWithDetails = await this.friendRepository.findAllWithDetails();
            return friendsWithDetails ? friendsWithDetails : null;
        } catch (error) {
            throw new Error(`Failed to list friends: ${error.message}`);
        }
    }

    async acceptFriendRequest(id) {
        try {
            if (!id || isNaN(id)) {
                throw new Error('Invalid friend id');
            }
            const friend = await this.friendRepository.acceptRequest(id);
            return friend ? FriendDTO.fromEntity(friend) : null;
        } catch (error) {
            throw new Error(`Failed to accept friend request: ${error.message}`);
        }
    }

    async blockFriendRequest(id) {
        try {
            if (!id || isNaN(id)) {
                throw new Error('Invalid friend id');
            }
            const friend = await this.friendRepository.blockRequest(id);
            return friend ? FriendDTO.fromEntity(friend) : null;
        } catch (error) {
            throw new Error(`Failed to block friend request: ${error.message}`);
        }
    }
}
