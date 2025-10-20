/**
 * Data Transfer Object for a user
 */

export class UserDTO {
    constructor({ id = null, username, firstName, lastName, email }) {
        this.id = id;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    // constructor({ id = null, username, firstName, lastName, email, password, createdAt}) {
    //     this.id = id;
    //     this.username = username;
    //     this.firstName = firstName;
    //     this.lastName = lastName;
    //     this.email = email;
    //     this.password = password;
    //     this.createdAt = createdAt;
    // }

    // mapper to convert entity to DTO
    static fromEntity(entity) {
        return new UserDTO(entity);
    }
}
