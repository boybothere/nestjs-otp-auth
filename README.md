# NestJS & React OTP Authentication System

This project provides a full-stack boilerplate for implementing a complete user authentication system with NestJS and React. It is designed to be a starting point for building a robust and secure application, handling the entire user lifecycle from registration to authenticated sessions using one-time passwords (OTPs).

-----

## Project Overview

This application is built with a NestJS backend and a React frontend, using TypeORM for database management. It demonstrates a complete authentication flow, which includes:

* **Secure User Registration:** Creating new user accounts with hashed passwords.
* **OTP-Based Login:** A mandatory, email-based one-time password check for every login attempt.
* **JWT Session Management:** Using JSON Web Tokens to maintain authenticated user sessions.
* **Password Reset Flow:** A secure process for users to reset their forgotten passwords via an email link.

-----

## Features

* **Full-Stack Architecture:** A clear separation between the backend API and the frontend client.
* **OTP Authentication**: Secure login verification using codes sent to the user's email.
* **JWT for Sessions**: Stateless authentication to manage user sessions across requests.
* **TypeORM Integration**: Efficient and safe database operations for user and token management.
* **Protected Routes**: A sample profile page accessible only to authenticated users.

-----

## Getting Started

### Prerequisites

To run this project, you will need:

* **Node.js** (v18.x or higher)
* **npm** or **yarn**
* A running **PostgreSQL** database (or another TypeORM-supported database)
* An email testing service like **Mailtrap** for sending OTPs.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/boybothere/nestjs-otp-auth
    cd nestjs-otp-auth
    ```

2.  **Install backend dependencies:**

    ```bash
    cd backend
    npm install
    ```

3.  **Install frontend dependencies:**

    ```bash
    cd ../frontend
    npm install
    ```

4.  **Configuration**
    Create a `.env` file in the `backend` directory and add your credentials.

    ```env
    # Database Configuration
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=<your_db_user>
    DB_PASSWORD=<your_db_password>
    DB_DATABASE=<your_db_name>

    # JWT Secrets
    JWT_SECRET=<your_jwt_secret_key>
    JWT_RESET_SECRET=<your_jwt_reset_secret_key>

    # Email Configuration (using Mailtrap or similar)
    EMAIL_HOST=smtp.gmail.com
    PORT=587
    EMAIL=<your_gmail_address@gmail.com>
    PASSWORD=<your_google_app_password>

    # Frontend URL for Password Reset Link
    RESET_PASSWORD_URL=http://localhost:5173/reset-password
    ```

### Running the App

1.  **Start the backend server:** (from the `backend` directory)
    ```bash
    npm run start:dev
    ```

2.  **Start the frontend server:** (from the `frontend` directory)
    ```bash
    npm run dev
    ```

The backend will run on `http://localhost:3000` and the frontend on `http://localhost:5173`.

-----

## API Endpoints

This project exposes the following authentication and user management endpoints:

* **`POST /user/register`**
    * Registers a new user.
* **`POST /user/request-otp`**
    * Sends a new OTP to the user's email for login.
* **`POST /user/forgot-password`**
    * Initiates the password reset flow by sending a link to the user's email.
* **`POST /auth/login`**
    * Logs in a user with their email, password, and a valid OTP.
* **`POST /auth/reset-password`**
    * Sets a new password using a valid token from the reset link.
* **`GET /auth/profile`**
    * (Protected) Returns the profile of the currently authenticated user.
