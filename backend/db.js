require("dotenv").config();
const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "bank_management"
});

db.connect((err) => {
    if (err) {
        console.error("MySQL connection failed:", err.message);
        return;
    }
    console.log("MySQL connected successfully.");
});

module.exports = db;