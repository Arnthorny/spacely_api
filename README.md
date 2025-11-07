# Spacely API

Repository for Spacely Booking Service.

This project is a Node.js API backend for the Spacely Booking Service. 

## 1\. Features


  * **User Management:** Registration, login, and profile management.
  * **Space Management:** Creating, reading, updating, and deleting bookable spaces.
  * **Booking Management:** Creating, viewing, and managing bookings for spaces.

## 2\. Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Arnthorny/spacely_api.git
    cd spacely_api
    ```

2.  **Install dependencies:**
    This project uses `npm` for package management.

    ```bash
    npm install
    ```

## 3\. Configuration

This project requires environment variables to run.

1.  **Create a `.env` file:**
    Copy the example file to a new `.env` file in the root of the project.

    ```bash
    cp .env.example .env
    ```

2.  **Edit the `.env` file:**
    Open the `.env` file and fill in the required values (e.g., database URLs, API keys, port).


## 4\. Running the Application

Once installed and configured, you can start the application.

  * **To run in development (with hot-reloading):**

    ```bash
    npm run start-dev
    ```

  * **To run in production:**

    ```bash
    npm run start
    ```
## 5\. Linting and Formatting

This project is set up with ESLint and Prettier.

  * **To check for linting errors:**

    ```bash
    npm run lint
    ```

  * **To automatically fix formatting:**

    ```bash
    npm run format
    ```
