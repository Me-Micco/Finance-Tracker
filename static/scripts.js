document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expense-form");
    const budgetForm = document.getElementById("budget-form");
    const expenseListContainer = document.getElementById("expense-list");

    const categoryBudgets = {};

    // Navigate to Visualization Page
    document.getElementById("visualize-btn").addEventListener("click", () => {
        window.location.href = "/visualize";
    });

    // Load budgets first, then expenses for correct budget display
    loadBudgets().then(loadExpenses);

    // Add Expense Form Submission
    expenseForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        const formData = new FormData(expenseForm);
        const data = {
            date: formData.get("date"),
            category: formData.get("category").trim(),
            amount: parseFloat(formData.get("amount")),
            remark: formData.get("remark") || ""
        };

        // Save the expense
        await fetch("/add_expense", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        expenseForm.reset();
        loadExpenses();
    });

    // Set Budget Form Submission
    budgetForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(budgetForm);
        const category = formData.get("category").trim();
        const budget = parseFloat(formData.get("budget"));

        categoryBudgets[category] = budget;

        // Save updated budget
        await fetch("/set_budget", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ category, budget })
        });

        budgetForm.reset();
        loadBudgets();
    });

    // Load and display expenses grouped by category
    async function loadExpenses() {
        const response = await fetch("/get_expenses");
        const expenses = await response.json();

        // Group expenses by category
        const groupedExpenses = expenses.reduce((acc, expense) => {
            const { category } = expense;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(expense);
            return acc;
        }, {});

        renderExpenses(groupedExpenses);
    }

    // Load and display budgets
    async function loadBudgets() {
        const response = await fetch("/get_budgets");
        const budgets = await response.json();
        Object.assign(categoryBudgets, budgets);
    }

    // Render expenses grouped by category
    function renderExpenses(groupedExpenses) {
        expenseListContainer.innerHTML = "";

        Object.keys(groupedExpenses).forEach((category) => {
            const categoryExpenses = groupedExpenses[category];
            const total = categoryExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
            const budget = categoryBudgets[category] || "Not Set";

            // Create Category Header
            const categoryHeader = document.createElement("h3");
            categoryHeader.textContent = `${category} - Monthly Budget: ${budget}`;
            expenseListContainer.appendChild(categoryHeader);

            // Create Expense Table
            const table = document.createElement("table");
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Remark</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${categoryExpenses.map(exp => `
                        <tr>
                            <td>${exp.date}</td>
                            <td>${exp.amount}</td>
                            <td>${exp.remark || ""}</td>
                            <td>
                                <button class="delete-btn" data-date="${exp.date}" data-category="${category}" data-amount="${exp.amount}">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3">Total for ${category}</td>
                        <td>${total}</td>
                    </tr>
                </tfoot>
            `;
            expenseListContainer.appendChild(table);

            // Add Delete Button Functionality
            table.querySelectorAll(".delete-btn").forEach(button => {
                button.addEventListener("click", async (event) => {
                    const { date, category, amount } = event.target.dataset;
                    await fetch("/delete_expense", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ date, category, amount })
                    });
                    loadExpenses();
                });
            });
        });
    }
});