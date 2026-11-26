CREATE DATABASE IF NOT EXISTS bank_management;
USE bank_management;

DROP TABLE IF EXISTS bank_transaction;
DROP TABLE IF EXISTS loan;
DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS account;
DROP TABLE IF EXISTS branch;
DROP TABLE IF EXISTS customer;

CREATE TABLE customer (
    customer_id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(15),
    email VARCHAR(100),
    address VARCHAR(100)
);

CREATE TABLE branch (
    branch_id INT PRIMARY KEY,
    branch_name VARCHAR(50) NOT NULL,
    city VARCHAR(50),
    address VARCHAR(100)
);

CREATE TABLE account (
    account_no INT PRIMARY KEY,
    customer_id INT NOT NULL,
    branch_id INT NOT NULL,
    account_type VARCHAR(20) NOT NULL,
    balance DECIMAL(12,2) DEFAULT 0,
    opening_date DATE,
    pin VARCHAR(10) NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
    FOREIGN KEY (branch_id) REFERENCES branch(branch_id)
);

CREATE TABLE bank_transaction (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    account_no INT NOT NULL,
    transaction_type VARCHAR(20) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    transaction_date DATE NOT NULL,
    FOREIGN KEY (account_no) REFERENCES account(account_no)
);

CREATE TABLE loan (
    loan_id INT PRIMARY KEY,
    customer_id INT NOT NULL,
    loan_type VARCHAR(30),
    amount DECIMAL(12,2),
    interest_rate DECIMAL(5,2),
    loan_status VARCHAR(20),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

CREATE TABLE employee (
    employee_id INT PRIMARY KEY,
    name VARCHAR(50),
    branch_id INT,
    designation VARCHAR(30),
    salary DECIMAL(10,2),
    FOREIGN KEY (branch_id) REFERENCES branch(branch_id)
);

INSERT INTO customer VALUES
(1, 'Saket Kumar', '9876543210', 'saket@gmail.com', 'Patna'),
(2, 'Rahul Kumar', '9876543211', 'rahul@gmail.com', 'Bakhtiyarpur'),
(3, 'Aman Singh', '9876543212', 'aman@gmail.com', 'Patna'),
(4, 'Priya Sharma', '9876543213', 'priya@gmail.com', 'Delhi');

INSERT INTO branch VALUES
(101, 'Main Branch', 'Patna', 'Fraser Road'),
(102, 'Bakhtiyarpur Branch', 'Bakhtiyarpur', 'Station Road'),
(103, 'Delhi Branch', 'Delhi', 'Connaught Place');

INSERT INTO account VALUES
(10001, 1, 101, 'Savings', 25000.00, '2026-01-10', '1234'),
(10002, 2, 102, 'Savings', 15000.00, '2026-02-15', '2345'),
(10003, 3, 101, 'Current', 50000.00, '2026-03-20', '3456'),
(10004, 4, 103, 'Savings', 30000.00, '2026-04-05', '4567');

INSERT INTO bank_transaction
(account_no, transaction_type, amount, transaction_date)
VALUES
(10001, 'Deposit', 10000, '2026-05-01'),
(10001, 'Withdrawal', 2000, '2026-05-05'),
(10002, 'Deposit', 5000, '2026-05-10'),
(10003, 'Withdrawal', 10000, '2026-05-12'),
(10004, 'Deposit', 15000, '2026-05-15');

INSERT INTO loan VALUES
(501, 1, 'Home Loan', 500000, 7.50, 'Approved'),
(502, 2, 'Education Loan', 200000, 6.50, 'Approved'),
(503, 3, 'Car Loan', 300000, 8.00, 'Pending');

INSERT INTO employee VALUES
(201, 'Rajesh Kumar', 101, 'Manager', 65000),
(202, 'Amit Singh', 101, 'Clerk', 35000),
(203, 'Neha Sharma', 102, 'Manager', 60000),
(204, 'Ravi Kumar', 103, 'Clerk', 32000);