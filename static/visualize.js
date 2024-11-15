document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("/get_expenses");
    const expenses = await response.json();

    const categories = {};
    const categoryBudgets = {};
    const monthlyExpensesByCategory = {};

        // Helper function to map month index to month names
    const getMonthName = (monthIndex) => {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[parseInt(monthIndex, 10) - 1];
    };

    const monthIndices = [...new Set(expenses.map(({ date }) => date.split("-")[1]))].sort();
    const monthLabels = monthIndices.map(getMonthName);



    expenses.forEach(({ date, category, amount, monthly_budget }) => {
        const month = date.split("-")[1];
        if (!categories[category]) {
            categories[category] = 0;
            monthlyExpensesByCategory[category] = {};
        }
        categories[category] += parseFloat(amount);
        if (!monthlyExpensesByCategory[category][month]) {
            monthlyExpensesByCategory[category][month] = 0;
        }
        monthlyExpensesByCategory[category][month] += parseFloat(amount);
        if (monthly_budget) {
            categoryBudgets[category] = parseFloat(monthly_budget);
        }
    });

    const categoryLabels = Object.keys(categories);
    const categoryData = Object.values(categories);

    const colors = categoryLabels.map((_, index) => {
        // Generate a unique color for each category using HSL for variety
        const hue = (index * 50) % 360;
        return `hsl(${hue}, 70%, 50%)`;
    });

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'top' },
        },
        scales: {
            x: { beginAtZero: true },
            y: { beginAtZero: true },
        },
    };

    // **Updated Bar Chart**: Expenses vs. Category
    new Chart(document.getElementById("barChart"), {
        type: 'bar',
        data: {
            labels: categoryLabels,
            datasets: [{
                label: 'Total Expenses by Category',
                data: categoryData,
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 1,
            }],
        },
        options: chartOptions,
    });

    // **Updated Pie Chart**: Assign different colors to each category
    new Chart(document.getElementById("pieChart"), {
        type: 'pie',
        data: {
            labels: categoryLabels,
            datasets: [{
                data: categoryData,
                backgroundColor: colors,
                borderColor: '#fff',
                borderWidth: 1,
            }],
        },
        options: chartOptions,
    });

    const lineChartDatasets = categoryLabels.map((category, index) => {
        const expenseData = monthIndices.map((month) => monthlyExpensesByCategory[category][month] || 0);
        return {
            label: `${category} Expense`,
            data: expenseData,
            borderColor: colors[index],
            backgroundColor: colors[index],
            fill: false,
            tension: 0.3,
        };
    });
    
    const budgetLineDataset = categoryLabels.map((category) => ({
        label: `${category} Budget`,
        data: Array(monthIndices.length).fill(categoryBudgets[category] || 0),
        borderColor: 'red',
        borderDash: [5, 5], // Dashed red line for the budget
        fill: false,
        tension: 0.3,
    }));
    
    new Chart(document.getElementById("lineChart"), {
        type: 'line',
        data: {
            labels: monthLabels, // Use month names for x-axis
            datasets: [...lineChartDatasets, ...budgetLineDataset],
        },
        options: chartOptions,
    });
    

    const scatterData = categoryLabels.map((category, index) => ({
        label: category,
        data: monthIndices.map((month, i) => ({ x: i, y: monthlyExpensesByCategory[category][month] || 0 })),
        backgroundColor: colors[index],
        borderColor: colors[index],
        borderWidth: 1,
    }));
    
    new Chart(document.getElementById("scatterChart"), {
        type: 'scatter',
        data: { datasets: scatterData },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'category', // Change to category type
                    labels: monthLabels, // Use month names for x-axis
                    title: { display: true, text: 'Month' },
                },
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Expense Amount' },
                },
            },
            plugins: {
                legend: { display: true, position: 'top' },
            },
        },
    });    

    // Back Button
    document.getElementById("back-btn").addEventListener("click", () => {
        window.location.href = "/";
    });
});