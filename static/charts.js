// charts.js

// Function to render pie chart
export function renderPieChart(expenseData) {
    const pieChartCtx = document.getElementById("expensePieChart").getContext("2d");
    
    // Aggregate expenses by category
    const categoryTotals = {};
    expenseData.forEach((expense) => {
        const category = expense.category;
        const amount = parseFloat(expense.amount);
        categoryTotals[category] = (categoryTotals[category] || 0) + amount;
    });

    // Generate the pie chart
    new Chart(pieChartCtx, {
        type: 'pie',
        data: {
            labels: Object.keys(categoryTotals),
            datasets: [{
                data: Object.values(categoryTotals),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

// Function to render bar chart
export function renderBarChart(expenseData) {
    const barChartCtx = document.getElementById("expenseBarChart").getContext("2d");
    
    // Aggregate expenses by month
    const monthlyExpenses = {};
    expenseData.forEach((expense) => {
        const month = expense.date.slice(0, 7); // YYYY-MM format
        const amount = parseFloat(expense.amount);
        monthlyExpenses[month] = (monthlyExpenses[month] || 0) + amount;
    });

    // Generate the bar chart
    new Chart(barChartCtx, {
        type: 'bar',
        data: {
            labels: Object.keys(monthlyExpenses),
            datasets: [{
                label: 'Monthly Expenses',
                data: Object.values(monthlyExpenses),
                backgroundColor: '#2596be'
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Month'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Amount'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}
