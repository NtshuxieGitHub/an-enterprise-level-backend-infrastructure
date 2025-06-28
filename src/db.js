// Import necessary modules
import { DatabaseSync } from "node:sqlite";

// Initialize the SQLite database
const sqlDb = new DatabaseSync(":memory:");

// Execute SQL statements from strings
sqlDb.exec(`
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )
    `);

sqlDb.exec(`
    CREATE TABLE todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        task TEXT,
        completed BOOLEAN DEFAULT FALSE,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    `);

export default sqlDb;
