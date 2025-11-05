# Messaging Website
This website allows users to add each other as friends and chat together. 

## Setup and Running Instructions
Download the source code files, then download all the dependencies by running `npm i` in the project directory.

After that, run `npm run start` to run the application.

## Database Schema Description
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
- created_at : data

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
- cors (version 2.8.5)
- dotenv (version 17.2.3)
- express (version 5.1.0)
- express-validator (version 7.2.1)
- pg (version 8.16.3)
