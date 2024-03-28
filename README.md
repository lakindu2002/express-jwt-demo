# Express + JWT

This repository contains a sample project that builds a REST API with JWT authentication and authorization. 

## Setup

1. Clone the repository
2. Install project dependencies using - `npm i`
3. Launch the server using `node index.js`

## Endpoints

### POST /login

- Purpose: Authenticates a user and issues a JWT token.

- URL: /login

- Method: POST

- Request Body:
   - username (string): The user's username.
   - password (string): The user's password.
- Success Response:
   - Code: 200 OK
   - Content: { token: "<JWT_TOKEN>" } where <JWT_TOKEN> is the issued token.

- Error Response:
    - Code: 400 Bad Request
    - Content: { message: 'Invalid username or password' } if the username doesn't exist or the password is incorrect.

- Logic:
    - Validates the provided username and password against the users database.
    - If authentication is successful, issues a JWT token with the user's role, a 5-minute expiration, and the issuer set to 'my-api'.

### GET /users

- Purpose: Retrieves a list of all users. Requires admin role.
- URL: /users
- Method: GET
- Headers:
    - Authorization: Bearer <JWT_TOKEN> where <JWT_TOKEN> must include an admin role.
- Success Response:
    - Code: 200 OK
    - Content: JSON object containing an array of users.
- Error Response:
    - Code: 403 Forbidden if the JWT token is invalid or does not include the required admin role.
- Middleware: validateRequest('admin') checks the JWT token for the correct role and validity.

### GET /users/:id

- Purpose: Retrieves details for a specific user by their ID. Requires admin role.
- URL: /users/:userId
- Method: GET
- URL Parameters:
    - userId (required): The ID of the user to retrieve.
- Headers:
    - Authorization: Bearer <JWT_TOKEN> where <JWT_TOKEN> must include an admin role.
    - Success Response:
        - Code: 200 OK
    - Content: JSON object containing the user's details.
    - Error Responses:
        - Code: 404 Not Found if no user exists with the provided userId.
        - Code: 403 Forbidden if the JWT token is invalid or does not include the required admin role.
- Middleware: validateRequest('admin') checks the JWT token for the correct role and validity.