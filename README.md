# Video link 

https://drive.google.com/file/d/1_TFjLN813A58PwzOEZsxytf-6Gpz4ES_/view?usp=sharing

# github link

https://github.com/5haiirr/Expense-Training

# Expense Tracker

A full-stack Expense Tracker web application built using:

- Frontend: HTML, CSS, JavaScript, Bootstrap
- Backend: Node.js, Express.js
- Database: PostgreSQL


## Description

Expense Tracker is a web application that helps users manage their daily expenses.

The application allows users to:

- View all expenses
- Add new expenses
- Edit existing expenses
- Delete expenses
- Filter expenses by category
- View summary information about expenses


# Project Structure

```
Expense-Tracker
│
├── frontend
│   ├── index.html
│   ├── app.js
│   └── style.css
│
├── backend
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .env
│   └── .gitignore
│
├── schema.sql
└── README.md
```


# Database Setup

## Requirements

- PostgreSQL installed


## Create Database

Create the database:

```sql
CREATE DATABASE expense_tracker;
```

After creating the database, connect to it and run the `schema.sql` file.

The schema file will create the required tables and insert sample data.


## Database Table

The project uses an `expenses` table:

| Column | Type |
|---|---|
| id | SERIAL PRIMARY KEY |
| title | VARCHAR(100) |
| amount | NUMERIC(10,2) |
| category | VARCHAR(50) |
| date | DATE |



# Backend Setup

Go to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```


Create a `.env` file:

```env
DB_USER=your_username
DB_HOST=localhost
DB_NAME=expense_tracker
DB_PASSWORD=your_password
DB_PORT=5432
PORT=3000
```


Start the backend server:

```bash
node server.js
```


The backend server will run on:

```
http://localhost:3000
```



# Frontend Setup

Open the frontend folder:

```
frontend/index.html
```

Run the frontend using:

- VS Code Live Server
- Any local web server



# API Endpoints


## Get All Expenses

```
GET /api/expenses
```


## Get Expense By ID

```
GET /api/expenses/:id
```


## Create Expense

```
POST /api/expenses
```


Example request:

```json
{
    "title": "Food",
    "amount": 25,
    "category": "Food",
    "date": "2026-09-30"
}
```


## Update Expense

```
PUT /api/expenses/:id
```


## Delete Expense

```
DELETE /api/expenses/:id
```



# Features

- PostgreSQL database integration
- REST API
- CRUD operations
- Frontend and Backend separation
- Form validation
- Category filtering
- Edit expenses using modal
- Delete expenses
- Loading spinner
- Error handling
- Responsive design



# Technologies Used


## Frontend

- HTML5
- CSS3
- JavaScript ES6
- Bootstrap 5


## Backend

- Node.js
- Express.js
- PostgreSQL
- pg library
- dotenv
- cors



# Application Flow

```
Frontend
    |
    | fetch()
    |
Backend API
    |
    | SQL Queries
    |
PostgreSQL Database
```


The frontend communicates with the backend through REST API endpoints.

The backend handles requests, communicates with the database, and returns responses in JSON format.

