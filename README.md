# 📝 To-Do App Backend

This is the backend system for a **Vanilla JS To-Do Application**, built with **Node.js**, **PostgreSQL**, **JWT**, **Docker**, and **bcrypt**.

---

## 🔧 Tech Stack

- **Node.js** – Runtime environment
- **Express.js** – Web framework
- **PostgreSQl** –Enterprise-level database
- **bcrypt** – Password hashing
- **JWT (JSON Web Token)** – Authentication
- **Vanilla JS (Frontend)** – Interacts with this backend
- **Docker**

---

## 📁 Features

### 🔐 Auth Routes

- `POST /register` – Register new user
  - Encrypts password using `bcrypt`
  - Creates a default to-do list for the user
- `POST /login` – Log in existing user
  - Verifies credentials and returns a signed JWT

### ✅ To-Do Routes (Protected)

- `POST /todos` – Create a new to-do item
- `PUT /todos/:id` – Update an existing to-do item
- `DELETE /todos/:id` – Delete a to-do item
- `GET /todos` – Fetch all to-dos for the authenticated user

### 🧠 Middleware

- **Authentication Middleware**
  - Verifies JWT token
  - Attaches user info to the request object

---

## 🗃️ Database Structure

### Users Table

| Column   | Type    | Notes                     |
| -------- | ------- | ------------------------- |
| id       | INTEGER | Primary Key Autoincrement |
| username | TEXT    |                           |
| password | TEXT    | Hashed with bcrypt        |

### Todos Table

| Column    | Type    | Notes                     |
| --------- | ------- | ------------------------- |
| id        | INTEGER | Primary Key Autoincrement |
| user_id   | INTEGER |                           |
| task      | TEXT    |                           |
| completed | BOOLEAN | Default: false            |

---

## 🚀 Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/NtshuxieGitHub/a-sophisticated-backend
   cd your-project-folder
   ```

2. **Install dependencies**

   ```
   npm install
   ```

3. **Set up an .env**

```
PORT=5005
JWT_SECRET_KEY="jwt_secret_key"
```

4. **Run the development server**

   ```
   npm run dev
   ```

   Ensure SQLite DB is created with required tables

5. **Run API Emulations**
   Use the following template:

```
todo-app.rest
```

## 🔐 Authentication Flow

On registration or login, a JWT is generated and sent to the frontend.

The frontend must send the token as a Bearer token in the Authorization header for all protected routes.

## 📌 Notes

This project assumes a simple default to-do is created on user registration.

The backend is modular with separate route files and middleware.

## 📫 Contact

Have questions? Feel free to open an issue or reach out at ntshuxekom98@gmail.com!
