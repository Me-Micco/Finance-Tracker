from flask import Flask, request, jsonify, render_template
import json
import os

app = Flask(__name__)

# Paths for data files
EXPENSE_FILE = "data/expenses.json"
BUDGET_FILE = "data/budgets.json"

# Utility Functions
def load_expenses():
    if os.path.exists(EXPENSE_FILE):
        with open(EXPENSE_FILE, 'r') as f:
            return json.load(f)
    return []

def save_expenses(expenses):
    with open(EXPENSE_FILE, 'w') as f:
        json.dump(expenses, f, indent=4)

def load_budgets():
    if os.path.exists(BUDGET_FILE):
        with open(BUDGET_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_budgets(budgets):
    with open(BUDGET_FILE, 'w') as f:
        json.dump(budgets, f, indent=4)

# Routes
@app.route('/')
def home():
    return render_template("index.html")

@app.route('/visualize')
def visualize():
    return render_template("visualize.html")

# Add a new expense
@app.route('/add_expense', methods=['POST'])
def add_expense():
    data = request.json
    date = data['date']
    category = data['category']
    amount = float(data['amount'])
    monthly_budget = float(data.get('monthly_budget', 0))

    expenses = load_expenses()
    expenses.append({
        "date": date,
        "category": category,
        "amount": amount,
        "monthly_budget": monthly_budget
    })
    save_expenses(expenses)
    return jsonify({"message": "Expense added successfully!"})

# Fetch all expenses
@app.route('/get_expenses', methods=['GET'])
def get_expenses():
    expenses = load_expenses()
    return jsonify(expenses)

@app.route('/delete_expense', methods=['POST'])
def delete_expense():
    data = request.json
    date = data['date']
    category = data['category']
    amount = float(data['amount'])

    expenses = load_expenses()

    # Delete the first matching entry
    for expense in expenses:
        if (expense['date'] == date and 
            expense['category'] == category and 
            float(expense['amount']) == amount):
            expenses.remove(expense)
            break

    save_expenses(expenses)
    return jsonify({"message": "Expense deleted successfully!"})


# Set a fixed budget for a category
@app.route('/set_budget', methods=['POST'])
def set_budget():
    data = request.json
    category = data['category']
    budget = float(data['budget'])

    budgets = load_budgets()
    budgets[category] = budget
    save_budgets(budgets)
    return jsonify({"message": f"Budget for '{category}' set to {budget}!"})

# Get all budgets
@app.route('/get_budgets', methods=['GET'])
def get_budgets():
    budgets = load_budgets()
    return jsonify(budgets)

if __name__ == "__main__":
    app.run(debug=True)