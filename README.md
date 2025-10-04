# MongoDB Fundamentals - Week 1

# 📚 PLP Bookstore MongoDB Project

This project is a MongoDB-based assignment for managing a bookstore database. It demonstrates basic CRUD operations, advanced filtering, aggregation pipelines, and indexing for performance optimization.



## 📁 Project Structure

plp_bookstore_project/

│── insert_books.js # Script to populate the database with initial book data

│── queries.js # Contains all MongoDB operations (CRUD, Aggregation, Indexing)

│── screenshots # of MongoDB Compass and terminal showing the collections and sample data

└── README.md # Project documentation


---

### ✅ Prerequisites

- MongoDB Community Edition installed
- MongoDB Shell (`mongosh`)
- VS Code (optional but recommended)
- Powershell to run locally
---

## 🚀 How to Run

### 1️⃣ Insert Sample Data

```sh

npm run insert_books.js

```

This creates the plp_bookstore database and inserts multiple book documents.

2️⃣ Run All Queries 

```sh

npm run  queries.js

```

This file includes:

📌 Basic CRUD operations

🔍 Advanced queries (filter, projection, pagination, sorting)

📊 Aggregation pipelines (average price, most published author, grouping by decade)

⚡ Indexing + performance analysis with explain()

## ✅ Features Demonstrated

Feature	Covered In

Database & Collection Setup	insert_books.js
Insert Multiple Documents	insert_books.js
Find / Update / Delete	queries.js
Filtering & Projection	queries.js
Sorting, Limit & Skip	queries.js
Aggregation Pipelines	queries.js
Indexing & Performance Test	queries.js

## 🧠 Notes

You can modify genres, authors, or book titles in the scripts to test different scenarios.

If using MongoDB Compass, you can paste the queries directly inside the GUI.

## 🤝 Author

Jennifer Omoregie

