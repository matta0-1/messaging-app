# Messaging Website
This website allows users to add each other as friends and chat together. 

## Installation and Setup
Download the source code files, then download all the dependencies by running `npm i` in the project directory.

After that, run `npm run start` to run the application.

## Database Schema
The database is formed of three tables: users, friends, and messages.

#### users
Contains user information.

Columns:
- id : integer (Primary Key)
- username : text
- first_name : text
- last_name : text
- email : text
- password : text
- created_at : date

#### friends
Contains information about which users are friends and since when.

Columns:
- id : integer (Primary Key)
- date_added : date
- state: char (**a**: Accepted, **b**: Blocked, **p**: Pending)
- user1_id : integer (Foreign Key to id in users table)
- user2_id : integer (Foreign Key to id in users table)

#### messages
Contains information about messages sent on the site.

**NOTE:** Users must be friends before being able to send messages to each other.

Columns:
- id : integer (Primary Key)
- content : text
- sender_id : integer (Foreign Key to id in users table)
- receiver_id : integer (Foreign Key to id in users table)
- sent_at : timestamp with time zone
- edited_at : timestamp with time zone

## API Endpoints
- [User Routes](/src/routes/userRoutes.js): Access all user-related information, find all friends of users, add, modify, and delete users
- [Friend Routes](/src/routes/friendRoutes.js): Access all friend-related information, find all friends, add, modify, and delete friends
- [Message Routes](/src/routes/messageRoutes.js): Access all message-related information, find all messages, find conversation between 2 users, add, modify, and delete messages

## Third-Party libraries and tools used
- "bcrypt": "^6.0.0",
- "cookie-parser": "^1.4.7",
- "cors": "^2.8.5",
- "dotenv": "^17.2.3",
- "ejs": "^3.1.10",
- "express": "^5.1.0",
- "express-ejs-layouts": "^2.5.1",
- "express-validator": "^7.2.1",
- "jsonwebtoken": "^9.0.3",
- "method-override": "^3.0.0",
- "pg": "^8.16.3"

## Frontend operations
The website uses cookies to ensure users remain logged in after entering their information in the login/signup form.
Once logged in, they can search for other users and send friend requests.
Once this request is accepted, the users can chat together and edit messages after they are sent.
Users can also modify their email address and password, log out and delete their account.
