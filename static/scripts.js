document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expense-form");
    const expenseTable = document.getElementById("expense-table").querySelector("tbody");

    document.getElementById("visualize-btn").addEventListener("click", () => {
        window.location.href = "/visualize";
    });
    

    expenseForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        const formData = new FormData(expenseForm);
        const data = {
            date: formData.get("date"),
            category: formData.get("category"),
            amount: formData.get("amount"),
            monthly_budget: formData.get("monthly_budget") || "0"
        };

        await fetch("/add_expense", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        expenseForm.reset();
        loadExpenses();
    });

    async function loadExpenses() {
        const response = await fetch("/get_expenses");
        const expenses = await response.json();

        expenseTable.innerHTML = "";
        expenses.forEach((expense) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${expense.date}</td>
                <td>${expense.category}</td>
                <td>${expense.amount}</td>
                <td>${expense.monthly_budget}</td>
                <td><button class="delete-btn" data-date="${expense.date}" data-category="${expense.category}" data-amount="${expense.amount}" data-monthly_budget="${expense.monthly_budget}">Delete</button></td>
            `;
            expenseTable.appendChild(row);
        });

        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", async (event) => {
                const { date, category, amount, monthly_budget } = event.target.dataset;

                await fetch("/delete_expense", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ date, category, amount, monthly_budget })
                });

                loadExpenses();
            });
        });
    }

    loadExpenses();
});