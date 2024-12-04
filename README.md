# Finance Tracker

Finance Tracker is a web-based application designed to help users efficiently manage their finances, including tracking expenses, setting budgets, and analyzing spending trends. Built with Flask and Chart.js, it provides a seamless way to add, view, and visualize financial data.

## Features

### Core Functionalities
- **Add Expense**: Record expenses by providing the date, category, amount, and optional remarks.
- **Set Budget**: Define monthly budgets for specific categories.
- **Delete Expense**: Remove expenses from the record by selecting them.
- **View Expense List**: Display a detailed list of all recorded expenses.

### Visualization Options
- **Line Chart**: Compare monthly expenses against total budget over time.
- **Bar Chart**: View monthly total expenses.
- **Pie Chart**: Analyze expenses by category for a clear distribution.

## Technologies Used
- **Backend**: Python with Flask
- **Frontend**: HTML, CSS, and Chart.js
- **Storage**: JSON files for expense and budget data

## Installation

### Prerequisites
Ensure you have the following installed:
- Python 3.x
- Pip

### Steps

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/me-micco/Finance-Tracker.git

2. **Navigate to the Project Directory**:

bash
    cd Finance-Tracker

3. **Install Dependencies**:

bash
    pip install -r requirements.txt

4. **Run the Application**:

bash
    python app.py

5. **Access the Application**:

Open your web browser and go to http://127.0.0.1:5000.

Usage
Adding Expenses
Navigate to the Add Expense section.
Fill in the fields:
Date
Category
Amount
(Optional) Remark
Click Add Expense.
Setting Budgets
Go to the Set Budget section.
Provide the category and budget amount.
Click Set Budget.
Visualizing Data
View visual representations of your expenses and budgets in the Charts section:

Line Chart: Compare expenses and budgets over time.
Bar Chart: Monitor monthly expenses.
Pie Chart: Check expense distribution by category.
File Structure
plaintext
    Finance-Tracker/
├── app.py                  # Main application script
├── templates/              # HTML templates for the web interface
│   ├── dashboard.html
├── static/                 # Static files (CSS, JavaScript, etc.)
│   ├── styles.css
├── data/                   # JSON files for storing data
│   ├── budgets.json
│   ├── expenses.json
├── requirements.txt        # Required Python packages
└── README.md               # Project documentation

Future Enhancements
User Authentication: Secure accounts for individual users.
Export Data: Allow users to export expense and budget data to CSV or Excel.
Advanced Analytics: Provide more detailed insights, such as savings patterns or predicted future expenses.
License
This project is licensed under the GPL License. See the LICENSE file for details.

Author
Sachi Verma
Feel free to contribute to this project by submitting pull requests or reporting issues.