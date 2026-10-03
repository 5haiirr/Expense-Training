// ==========================
// GET ELEMENTS FROM HTML
// ==========================

const expensesTable =
    document.getElementById("expensesTable");

const message =
    document.getElementById("message");

const loading =
    document.getElementById("loading");


// Add form

const expenseForm =
    document.getElementById("expenseForm");

const titleInput =
    document.getElementById("title");

const amountInput =
    document.getElementById("amount");

const categoryInput =
    document.getElementById("category");

const dateInput =
    document.getElementById("date");

const formMessage =
    document.getElementById("formMessage");


// Filter

const categoryFilter =
    document.getElementById("categoryFilter");


// Summary

const totalAmount =
    document.getElementById("totalAmount");

const expenseCount =
    document.getElementById("expenseCount");

const highestExpense =
    document.getElementById("highestExpense");


// Edit modal

const editModalElement =
    document.getElementById("editModal");

const editModal =
    new bootstrap.Modal(editModalElement);

const editForm =
    document.getElementById("editForm");

const editId =
    document.getElementById("editId");

const editTitle =
    document.getElementById("editTitle");

const editAmount =
    document.getElementById("editAmount");

const editCategory =
    document.getElementById("editCategory");

const editDate =
    document.getElementById("editDate");

const editMessage =
    document.getElementById("editMessage");


// ==========================
// DATA
// ==========================

let allExpenses = [];


// ==========================
// SHOW MESSAGE
// ==========================

function showMessage(messageText, type) {

    message.innerHTML = `
        <div class="alert alert-${type}">
            ${messageText}
        </div>
    `;

}


// ==========================
// SHOW FORM MESSAGE
// ==========================

function showFormMessage(messageText, type) {

    formMessage.innerHTML = `
        <div class="alert alert-${type}">
            ${messageText}
        </div>
    `;

}


// ==========================
// LOAD EXPENSES
// ==========================

async function loadExpenses() {

    try {

        loading.classList.remove("d-none");

        message.innerHTML = "";


        const response = await fetch(
            "http://localhost:3000/api/expenses"
        );


        if (!response.ok) {

            throw new Error(
                "Could not load expenses. Please check the server."
            );

        }


        allExpenses =
            await response.json();


        updateSummary();


        filterExpenses();


    } catch (error) {

        expensesTable.innerHTML = "";

        showMessage(
            error.message,
            "danger"
        );

    } finally {

        loading.classList.add("d-none");

    }

}


// ==========================
// UPDATE SUMMARY
// ==========================

function updateSummary() {

    const total =
        allExpenses.reduce(
            (sum, expense) =>
                sum + Number(expense.amount),
            0
        );


    const count =
        allExpenses.length;


    const highest =
        allExpenses.length > 0
            ? Math.max(
                ...allExpenses.map(
                    expense =>
                        Number(expense.amount)
                )
            )
            : 0;


    totalAmount.textContent =
        `$${total.toFixed(2)}`;


    expenseCount.textContent =
        count;


    highestExpense.textContent =
        `$${highest.toFixed(2)}`;

}


// ==========================
// DISPLAY EXPENSES
// ==========================

function displayExpenses(expenses) {

    expensesTable.innerHTML = "";


    if (expenses.length === 0) {

        expensesTable.innerHTML = `
            <tr>
                <td
                    colspan="5"
                    class="text-center"
                >
                    No expenses found.
                </td>
            </tr>
        `;

        return;

    }


    expenses.forEach(expense => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${expense.title}
            </td>

            <td>
                $${Number(expense.amount).toFixed(2)}
            </td>

            <td>

                <span class="badge bg-primary">
                    ${expense.category}
                </span>

            </td>

            <td>
                ${expense.date}
            </td>

            <td>

                <button
                    class="btn btn-warning btn-sm me-1 edit-button"
                    data-id="${expense.id}"
                >
                    Edit
                </button>

                <button
                    class="btn btn-danger btn-sm delete-button"
                    data-id="${expense.id}"
                >
                    Delete
                </button>

            </td>

        `;


        expensesTable.appendChild(row);

    });


    // Edit buttons

    const editButtons =
        document.querySelectorAll(
            ".edit-button"
        );


    editButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => openEditModal(button.dataset.id)
        );

    });


    // Delete buttons

    const deleteButtons =
        document.querySelectorAll(
            ".delete-button"
        );


    deleteButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => deleteExpense(button.dataset.id)
        );

    });

}


// ==========================
// FILTER
// ==========================

function filterExpenses() {

    const selectedCategory =
        categoryFilter.value;


    if (selectedCategory === "All") {

        displayExpenses(allExpenses);

        return;

    }


    const filteredExpenses =
        allExpenses.filter(
            expense =>
                expense.category ===
                selectedCategory
        );


    displayExpenses(filteredExpenses);

}


// ==========================
// FILTER EVENT
// ==========================

categoryFilter.addEventListener(
    "change",
    filterExpenses
);


// ==========================
// ADD EXPENSE
// ==========================

expenseForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const title =
            titleInput.value.trim();

        const amount =
            Number(amountInput.value);

        const category =
            categoryInput.value;

        const date =
            dateInput.value;


        // Validation

        if (!title) {

            showFormMessage(
                "Title is required",
                "danger"
            );

            return;

        }


        if (!amount || amount <= 0) {

            showFormMessage(
                "Amount must be greater than 0",
                "danger"
            );

            return;

        }


        if (!category) {

            showFormMessage(
                "Please select a category",
                "danger"
            );

            return;

        }


        if (!date) {

            showFormMessage(
                "Date is required",
                "danger"
            );

            return;

        }


        try {

            const response = await fetch(
                "http://localhost:3000/api/expenses",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        title,
                        amount,
                        category,
                        date
                    })

                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to add expense"
                );

            }


            expenseForm.reset();


            showFormMessage(
                "Expense added successfully",
                "success"
            );


            // Get fresh data from server

            await loadExpenses();


        } catch (error) {

            showFormMessage(
                error.message,
                "danger"
            );

        }

    }
);


// ==========================
// DELETE EXPENSE
// ==========================

async function deleteExpense(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this expense?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response = await fetch(
            `http://localhost:3000/api/expenses/${id}`,
            {
                method: "DELETE"
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to delete expense"
            );

        }


        showMessage(
            "Expense deleted successfully",
            "success"
        );


        // Get fresh data

        await loadExpenses();


    } catch (error) {

        showMessage(
            error.message,
            "danger"
        );

    }

}


// ==========================
// OPEN EDIT MODAL
// ==========================

function openEditModal(id) {

    const expense =
        allExpenses.find(
            item =>
                Number(item.id) === Number(id)
        );


    if (!expense) {

        showMessage(
            "Expense not found",
            "danger"
        );

        return;

    }


    editId.value =
        expense.id;

    editTitle.value =
        expense.title;

    editAmount.value =
        expense.amount;

    editCategory.value =
        expense.category;

    editDate.value =
        expense.date;

    editMessage.innerHTML = "";


    editModal.show();

}


// ==========================
// UPDATE EXPENSE
// ==========================

editForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const id =
            editId.value;

        const title =
            editTitle.value.trim();

        const amount =
            Number(editAmount.value);

        const category =
            editCategory.value;

        const date =
            editDate.value;


        // Validation

        if (!title) {

            editMessage.innerHTML = `
                <div class="alert alert-danger">
                    Title is required
                </div>
            `;

            return;

        }


        if (!amount || amount <= 0) {

            editMessage.innerHTML = `
                <div class="alert alert-danger">
                    Amount must be greater than 0
                </div>
            `;

            return;

        }


        if (!category) {

            editMessage.innerHTML = `
                <div class="alert alert-danger">
                    Please select a category
                </div>
            `;

            return;

        }


        if (!date) {

            editMessage.innerHTML = `
                <div class="alert alert-danger">
                    Date is required
                </div>
            `;

            return;

        }


        try {

            const response = await fetch(
                `http://localhost:3000/api/expenses/${id}`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        title,
                        amount,
                        category,
                        date
                    })

                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to update expense"
                );

            }


            editModal.hide();


            showMessage(
                "Expense updated successfully",
                "success"
            );


            // Get fresh data

            await loadExpenses();


        } catch (error) {

            editMessage.innerHTML = `
                <div class="alert alert-danger">
                    ${error.message}
                </div>
            `;

        }

    }
);


// ==========================
// INITIAL LOAD
// ==========================

loadExpenses();