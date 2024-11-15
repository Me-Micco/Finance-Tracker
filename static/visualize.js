document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("/get_expenses");
    const expenses = await response.json();

    const months = {};
    const categories = {};
    const categoryBudgets = {};

    expenses.forEach(({ date, category, amount, monthly_budget }) => {
        const month = date.split("-")[1];
        months[month] = (months[month] || 0) + parseFloat(amount);
        categories[category] = (categories[category] || 0) + parseFloat(amount);
        if (monthly_budget) {
            categoryBudgets[category] = parseFloat(monthly_budget);
        }
    });

    const monthLabels = Object.keys(months);
    const monthData = Object.values(months);

    const categoryLabels = Object.keys(categories);
    const categoryData = Object.values(categories);

    // Bar Chart for Monthly Expenses
    new Chart(document.getElementById("barChart"), {
        type: 'bar',
        data: {
            labels: monthLabels,
            datasets: [{
                label: 'Total Expenses',
                data: monthData,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    // Pie Chart for Expenses by Category
    new Chart(document.getElementById("pieChart"), {
        type: 'pie',
        data: {
            labels: categoryLabels,
            datasets: [{
                data: categoryData,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            }]
        },
        options: { responsive: true }
    });

    // Line Chart for Category Expenses vs Budget
    new Chart(document.getElementById("lineChart"), {
        type: 'line',
        data: {
            labels: monthLabels,
            datasets: categoryLabels.map((category, index) => ({
                label: `${category} Expense`,
                data: monthLabels.map(month => categories[category] || 0),
                borderColor: `rgba(${index * 50}, ${100 + index * 30}, 200, 1)`,
                fill: false
            }))
        },
        options: { responsive: true }
    });

    // Scatter Plot for Expenses by Month
    const scatterData = categoryLabels.map((category) => ({
        label: category,
        data: monthLabels.map((month, i) => ({ x: i, y: categories[category] || 0 })),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }));

    new Chart(document.getElementById("scatterChart"), {
        type: 'scatter',
        data: { datasets: scatterData },
        options: {
            responsive: true,
            scales: {
                x: { type: 'linear', position: 'bottom' },
                y: { beginAtZero: true }
            }
        }
    });

    // Back Button
    document.getElementById("back-btn").addEventListener("click", () => {
        window.location.href = "/";
    });
});
