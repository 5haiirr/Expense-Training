-- ==========================================
-- Expense Tracker Database Schema
-- ==========================================


-- Create Database
CREATE DATABASE expense_tracker;


-- ==========================================
-- Connect to the database:
-- expense_tracker
-- Then run the table creation below
-- ==========================================


-- Create Expenses Table

CREATE TABLE expenses (

    id SERIAL PRIMARY KEY,

    title VARCHAR(100) NOT NULL,

    amount NUMERIC(10,2) NOT NULL
        CHECK (amount > 0),

    category VARCHAR(50) NOT NULL,

    date DATE NOT NULL

);



-- ==========================================
-- Sample Data (Optional)
-- ==========================================

INSERT INTO expenses
(title, amount, category, date)
VALUES

('Food', 25.00, 'Food', '2026-09-30'),

('Gas', 40.00, 'Transport', '2026-09-30'),

('Internet Bill', 30.00, 'Bills', '2026-09-30');