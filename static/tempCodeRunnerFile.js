async function addExpense() {
    const date = document.getElementById("date").value;
    const category = document.getElementById("category").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const monthly_budget = parseFloat(document.getElementById("monthly_budget").value);

    const response = await fetch("/add_expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, category, amount, monthly_budget })
    });
    const result = await response.json();
    document.getElementById("status").innerText = result.message;
    viewExpenses(); // Refresh the expense list after adding
}

async function viewExpenses() {
    const response = await fetch("/get_expenses");
    const expenses = await response.json();

    const tableBody = document.getElementById("expensesTable").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = ""; // Clear existing rows

    expenses.forEach(expense => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${expense.date}</td>
            <td>${expense.category}</td>
            <td>${expense.amount}</td>
            <td>${expense.monthly_budget}</td>
        `;

        // Color coding based on budget
        if (parseFloat(expense.amount) > parseFloat(expense.monthly_budget)) {
            row.style.backgroundColor = "lightcoral"; // Over budget
        } else {
            row.style.backgroundColor = "lightgreen"; // Within budget
        }
    });
}

async function visualizeExpenses() {
    const response = await fetch("/get_expenses");
    const expenses = await response.json();

    const monthlyExpenses = {};
    const categoryExpenses = {};

    // Organize data by month and category
    expenses.forEach(expense => {
        const month = expense.date.slice(0, 7); // Extract YYYY-MM
        monthlyExpenses[month] = (monthlyExpenses[month] || 0) + parseFloat(expense.amount);
        categoryExpenses[expense.category] = (categoryExpenses[expense.category] || 0) + parseFloat(expense.amount);
    });

    // Monthly Expense Bar Chart
    const monthCtx = document.getElementById("monthlyExpenseChart").getContext("2d");
    new Chart(monthCtx, {
        type: 'bar',
        data: {
            labels: Object.keys(monthlyExpenses),
            datasets: [{
                label: 'Monthly Expenses',
                data: Object.values(monthlyExpenses),
                backgroundColor: 'skyblue'
            }]
        },
        options: {
            scales: {
                x: { title: { display: true, text: 'Month' } },
                y: { title: { display: true, text: 'Amount' } }
            }
        }
    });

    // Category Expense Pie Chart
    const categoryCtx = document.getElementById("categoryExpenseChart").getContext("2d");
    new Chart(categoryCtx, {
        type: 'pie',
        data: {
            labels: Object.keys(categoryExpenses),
            datasets: [{
                label: 'Category Expenses',
                data: Object.values(categoryExpenses),
                backgroundColor: ['lightcoral', 'lightgreen', 'skyblue', 'lightyellow']
            }]
        }
    });
}