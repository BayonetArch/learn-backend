### 1. 2xx (Success) — *Everything went great*

* **`200 OK`**: Standard success. Used for successful `GET` or `PUT` requests when returning data.
* **`201 Created`**: Success! Used specifically after a `POST` request that successfully created a new resource in the database.

### 2. 4xx (Client Error) — *You (the client) messed up*

* **`400 Bad Request`**: The server couldn't understand the request because syntax was wrong or missing data.
* **`401 Unauthorized`**: You aren't logged in / haven't provided authentication credentials.
* **`403 Forbidden`**: You are logged in, but you don't have permission to access this resource.
* **`404 Not Found`**: The route or resource you are looking for doesn't exist on the server.

### 3. 5xx (Server Error) — *We (the server) messed up*

* **`500 Internal Server Error`**: A catch-all for when your backend code crashed, threw an unhandled exception, or hit a database failure.
