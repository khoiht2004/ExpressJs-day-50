# API Documentation

## Auth

### Register

**POST** `/api/auth/register`

- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "your_password"
  }
  ```
- **Response:**
  - `201 Created`: User information
  - `409 Conflict`: Email already exists

### Login

**POST** `/api/auth/login`

- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "your_password"
  }
  ```
- **Response:**
  - `200 OK`:
    ```json
    {
      "id": 1,
      "email": "user@example.com",
      "access_token": "your_jwt_token",
      "expired_at": 1700000000
    }
    ```
  - `401 Unauthorized`: Invalid email or password

### Get Me

**GET** `/api/auth/me`

- **Headers:**
  - `Authorization`: `Bearer your_access_token`
- **Response:**
  - `200 OK`: User information

---

## Conversations

_Note: All conversation APIs require Authorization header._

### Create Conversation

**POST** `/api/conversations`

- **Headers:**
  - `Authorization`: `Bearer your_access_token`
- **Body (Group):**
  ```json
  {
    "name": "Group Name",
    "type": "group",
    "participant_ids": [2, 3] // Array of other user IDs (excluding yourself)
  }
  ```
- **Body (Direct):**
  ```json
  {
    "type": "direct",
    "participant_ids": [2] // Array with exactly ONE other user ID
  }
  ```
- **Response:**
  - `201 Created`: Created conversation object

### Get All Conversations

**GET** `/api/conversations`

- **Headers:**
  - `Authorization`: `Bearer your_access_token`
- **Response:**
  - `200 OK`: List of conversations created by current user

### Add Participants

**POST** `/api/conversations/:id/participants`

- **Headers:**
  - `Authorization`: `Bearer your_access_token`
- **Params:**
  - `id`: Conversation ID
- **Body:**
  ```json
  {
    "participant_ids": [4, 5] // Array of user IDs to add
  }
  ```
- **Response:**
  - `200 OK`: "Add participants successfully"
  - `400 Bad Request`: Invalid input or conversation is not a group

### Send Message

**POST** `/api/conversations/:id/messages`

- **Headers:**
  - `Authorization`: `Bearer your_access_token`
- **Params:**
  - `id`: Conversation ID
- **Body:**
  ```json
  {
    "content": "Hello world!"
  }
  ```
- **Response:**
  - `200 OK`: "Send message successfully"

### Get Messages

**GET** `/api/conversations/:id/messages`

- **Headers:**
  - `Authorization`: `Bearer your_access_token`
- **Params:**
  - `id`: Conversation ID
- **Response:**
  - `200 OK`: List of messages in the conversation, including sender details.

---

## Users

### Search User

**GET** `/api/users/search?q=email@example.com`

- **Headers:**
  - `Authorization`: `Bearer your_access_token`
- **Query Params:**
  - `q`: User's email to search for (must be exact match)
- **Response:**
  - `200 OK`: User information object
  - `404 Not Found`: "Users not found"
  - `400 Bad Request`: "You can not search yourself"
