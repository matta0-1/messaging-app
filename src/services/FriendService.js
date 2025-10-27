import { FriendDTO } from "../domain/dto/FriendDTO"
import { FriendWithDetailsDTO } from "../domain/dto/FriendWithDetailsDTO"

export class FriendService {
    /**
     * Construct a FriendService object
     * @param {FriendRepository} friendRepository 
     */
    constructor(friendRepository) {
        this.friendRepository = friendRepository;
    }

    async listFriends() {
        try {
            const friends = await this.friendRepository.findAll();
            return friends.map(friend => FriendDTO.fromEntity(friend));
        } catch (error) {
            throw new Error(`Failed to list friends: ${error.message}`);
        }
    }

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

    
}
