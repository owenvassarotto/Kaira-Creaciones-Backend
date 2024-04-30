# Kaira Accessories Backend

This is the backend for the Kaira Accessories project, a web page developed with Node.js, Express.js, Multer, and MySQL. This backend provides business logic, file management (such as product images), and communicates with the MySQL database to store and retrieve data related to products, users, and orders for the online store.

## Installation

1. Clone this repository on your local machine:

    ```bash
    git clone https://github.com/owenvassarotto/kaira-creaciones-backend.git
    ```

2. Navigate to the project directory:

    ```bash
    cd kaira-accessories-backend
    ```

3. Install the necessary dependencies:

    ```bash
    npm install
    ```

4. Set up environment variables. Copy the `.env.example` file and rename it to `.env`. Then, adjust the environment variables according to your setup:

    ```bash
    cp .env.example .env
    ```

5. Start the server:

    ```bash
    npm run dev
    ```

## Project Structure

- **`/routes`**: Contains route files that define the different API routes.
- **`/controllers`**: Contains controllers that handle HTTP requests and communicate with the database.
- **`/middleware`**: Contains custom middleware used in the application, such as authentication and file handling.
- **`/config`**: Contains database configuration and other application settings.
- **`/uploads`**: Folder where user-uploaded files, such as product images, are stored.

## Technologies Used

- **Node.js**: JavaScript runtime environment for server-side execution.
- **Express.js**: Web application framework for Node.js, used to create RESTful APIs.
- **Multer**: Node.js middleware for handling multipart/form-data, used for file uploads.
- **MySQL**: Relational database management system used to store system data.

## Contribution

Contributions are welcome. If you find a bug or have an idea for an improvement, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

