const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Bank Management System API is running" });
});

// Login using account number and PIN
app.post("/api/login", (req, res) => {
    const { account_no, pin } = req.body;

    if (!account_no || !pin) {
        return res.status(400).json({ message: "Account number and PIN are required" });
    }

    const sql = `
        SELECT c.customer_id, c.name, c.phone, c.email,
               a.account_no, a.account_type, a.balance, a.opening_date
        FROM customer c
        JOIN account a ON c.customer_id = a.customer_id
        WHERE a.account_no = ? AND a.pin = ?
    `;

    db.query(sql, [account_no, pin], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }

        if (result.length === 0) {
            return res.status(401).json({ message: "Invalid account number or PIN" });
        }

        res.json(result[0]);
    });
});

// Get account details
app.get("/api/account/:accountNo", (req, res) => {
    const accountNo = req.params.accountNo;

    const sql = `
        SELECT c.customer_id, c.name, c.phone, c.email,
               a.account_no, a.account_type, a.balance, a.opening_date,
               b.branch_name, b.city
        FROM customer c
        JOIN account a ON c.customer_id = a.customer_id
        JOIN branch b ON a.branch_id = b.branch_id
        WHERE a.account_no = ?
    `;

    db.query(sql, [accountNo], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });

        if (result.length === 0) {
            return res.status(404).json({ message: "Account not found" });
        }

        res.json(result[0]);
    });
});

// Deposit
app.post("/api/deposit", (req, res) => {
    const { account_no, amount } = req.body;
    const money = Number(amount);

    if (!account_no || !money || money <= 0) {
        return res.status(400).json({ message: "Enter a valid deposit amount" });
    }

    const updateSql = `
        UPDATE account
        SET balance = balance + ?
        WHERE account_no = ?
    `;

    db.query(updateSql, [money, account_no], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Account not found" });
        }

        const transactionSql = `
            INSERT INTO bank_transaction
            (account_no, transaction_type, amount, transaction_date)
            VALUES (?, 'Deposit', ?, CURDATE())
        `;

        db.query(transactionSql, [account_no, money], (transactionErr) => {
            if (transactionErr) {
                return res.status(500).json({ message: transactionErr.message });
            }

            res.json({ message: "Money deposited successfully" });
        });
    });
});

// Withdraw
app.post("/api/withdraw", (req, res) => {
    const { account_no, amount } = req.body;
    const money = Number(amount);

    if (!account_no || !money || money <= 0) {
        return res.status(400).json({ message: "Enter a valid withdrawal amount" });
    }

    const updateSql = `
        UPDATE account
        SET balance = balance - ?
        WHERE account_no = ?
        AND balance >= ?
    `;

    db.query(updateSql, [money, account_no, money], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Insufficient balance or account not found" });
        }

        const transactionSql = `
            INSERT INTO bank_transaction
            (account_no, transaction_type, amount, transaction_date)
            VALUES (?, 'Withdrawal', ?, CURDATE())
        `;

        db.query(transactionSql, [account_no, money], (transactionErr) => {
            if (transactionErr) {
                return res.status(500).json({ message: transactionErr.message });
            }

            res.json({ message: "Money withdrawn successfully" });
        });
    });
});

// Transaction history
app.get("/api/transactions/:accountNo", (req, res) => {
    const accountNo = req.params.accountNo;

    const sql = `
        SELECT transaction_id, transaction_type, amount, transaction_date
        FROM bank_transaction
        WHERE account_no = ?
        ORDER BY transaction_id DESC
    `;

    db.query(sql, [accountNo], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(result);
    });
});

// Loans
app.get("/api/loans/:customerId", (req, res) => {
    const customerId = req.params.customerId;

    const sql = `
        SELECT loan_id, loan_type, amount, interest_rate, loan_status
        FROM loan
        WHERE customer_id = ?
    `;

    db.query(sql, [customerId], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(result);
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});