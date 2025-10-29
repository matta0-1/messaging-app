/**
 * ADDD OTHERSS
 * The FriendService class contains methods to perform friend-related actions
 */

import { FriendDTO } from "../domain/dto/FriendDTO.js";
import { FriendWithDetailsDTO } from "../domain/dto/FriendWithDetailsDTO.js";
import { UserDTO } from "../domain/dto/UserDTO.js"; // to list friends of a user

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
                throw new Error('Invalid Friend ID');
            }
            const friend = await this.friendRepository.findById(id);
            if (!friend) {
                return null;
            }
            return FriendDTO.fromEntity(friend);
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
            throw new Error(`Failed to create friend: ${error.message}`);
        }
    }

    /**
     * Updates data of a friend row - CANNOT BE USED
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
            if (error.message === 'duplicate key value violates unique constraint "friends_user1_id_user2_id_key"') {
                throw new Error(`Failed to update friend: Users ${data.user1Id} and ${data.user2Id} are already friends`)
            } else {
                throw new Error(`Failed to update friend: ${error.message}`);
            }
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

    async listFriendsWithDetails() {
        try {
            const friendsWithDetails = await this.friendRepository.findAllWithDetails();
            return friendsWithDetails ? friendsWithDetails : null;
        } catch (error) {
            throw new Error(`Failed to list friends: ${error.message}`);
        }
    }
}
