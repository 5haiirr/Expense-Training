require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();


// MIDDLEWARE

app.use(cors());
app.use(express.json());


// DATABASE

const pool = new Pool({

    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT

});


// ALLOWED CATEGORIES

const allowedCategories = [
    "Food",
    "Transport",
    "Bills",
    "Entertainment",
    "Other"
];


// VALIDATION

function validateExpense(title, amount, category) {

    if (!title || title.trim() === "") {

        return "Title is required";

    }

    if (typeof amount !== "number" || amount <= 0) {

        return "Amount must be a number greater than 0";

    }

    if (!allowedCategories.includes(category)) {

        return "Invalid category";

    }

    return null;
}


// GET ALL EXPENSES

app.get("/api/expenses", async (req, res) => {

    try {

        const result = await pool.query(
            `
            SELECT
                id,
                title,
                amount,
                category,
                TO_CHAR(date, 'YYYY-MM-DD') AS date
            FROM expenses
            ORDER BY id
            `
        );

        res.status(200).json(result.rows);

    } catch (error) {

        res.status(500).json({
            message: "Error fetching expenses"
        });

    }

});


// GET ONE EXPENSE

app.get("/api/expenses/:id", async (req, res) => {

    try {

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {

            return res.status(404).json({
                message: "Expense not found"
            });

        }

        const result = await pool.query(
            `
            SELECT
                id,
                title,
                amount,
                category,
                TO_CHAR(date, 'YYYY-MM-DD') AS date
            FROM expenses
            WHERE id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Expense not found"
            });

        }

        res.status(200).json(result.rows[0]);

    } catch (error) {

        res.status(500).json({
            message: "Error fetching expense"
        });

    }

});


// POST EXPENSE

app.post("/api/expenses", async (req, res) => {

    try {

        const {
            title,
            amount,
            category,
            date
        } = req.body;

        const numericAmount = Number(amount);

        const validationError = validateExpense(
            title,
            numericAmount,
            category
        );

        if (validationError) {

            return res.status(400).json({
                message: validationError
            });

        }

        if (!date) {

            return res.status(400).json({
                message: "Date is required"
            });

        }

        const result = await pool.query(
            `
            INSERT INTO expenses
                (title, amount, category, date)
            VALUES
                ($1, $2, $3, $4)
            RETURNING
                id,
                title,
                amount,
                category,
                TO_CHAR(date, 'YYYY-MM-DD') AS date
            `,
            [
                title.trim(),
                numericAmount,
                category,
                date
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {

        res.status(500).json({
            message: "Error adding expense"
        });

    }

});


// PUT EXPENSE

app.put("/api/expenses/:id", async (req, res) => {

    try {

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {

            return res.status(404).json({
                message: "Expense not found"
            });

        }

        const {
            title,
            amount,
            category,
            date
        } = req.body;

        const numericAmount = Number(amount);

        const validationError = validateExpense(
            title,
            numericAmount,
            category
        );

        if (validationError) {

            return res.status(400).json({
                message: validationError
            });

        }

        if (!date) {

            return res.status(400).json({
                message: "Date is required"
            });

        }

        const result = await pool.query(
            `
            UPDATE expenses
            SET
                title = $1,
                amount = $2,
                category = $3,
                date = $4
            WHERE id = $5
            RETURNING
                id,
                title,
                amount,
                category,
                TO_CHAR(date, 'YYYY-MM-DD') AS date
            `,
            [
                title.trim(),
                numericAmount,
                category,
                date,
                id
            ]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Expense not found"
            });

        }

        res.status(200).json(result.rows[0]);

    } catch (error) {

        res.status(500).json({
            message: "Error updating expense"
        });

    }

});


// DELETE EXPENSE

app.delete("/api/expenses/:id", async (req, res) => {

    try {

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {

            return res.status(404).json({
                message: "Expense not found"
            });

        }

        const result = await pool.query(
            `
            DELETE FROM expenses
            WHERE id = $1
            RETURNING
                id,
                title,
                amount,
                category,
                TO_CHAR(date, 'YYYY-MM-DD') AS date
            `,
            [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Expense not found"
            });

        }

        res.status(200).json({
            message: "Expense deleted successfully",
            expense: result.rows[0]
        });

    } catch (error) {

        res.status(500).json({
            message: "Error deleting expense"
        });

    }

});


// START SERVER

app.listen(3000, () => {

    console.log("Server running on port 3000");

});