import os
import json
from datetime import datetime
from flask import Flask, render_template, request, jsonify, redirect, url_for

app = Flask(__name__)

# Path to the data directory
DATA_DIR = os.path.join(os.getcwd(), "data")
os.makedirs(DATA_DIR, exist_ok=True)  # Ensure data directory exists
BUDGETS_FILE = os.path.join(DATA_DIR, "budgets.json")
EXPENSES_FILE = os.path.join(DATA_DIR, "expenses.json")

# Utility functions to load and save JSON data
def load_data(file_path):
    try:
        with open(file_path, "r") as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        return [] if "expenses" in file_path else {}

def save_data(file_path, data):
    with open(file_path, "w") as f:
        json.dump(data, f, indent=4)

def generate_unique_id(data):
    """Generate a unique ID for new entries."""
    return max([entry.get('id', 0) for entry in data] + [0]) + 1

# Load budgets and expenses on startup
budgets = load_data(BUDGETS_FILE)
expenses = load_data(EXPENSES_FILE)

@app.route("/")
def dashboard():
    """Render the main dashboard with expenses and budgets"""
    # Ensure budgets do not have None values
    safe_budgets = {k: (v if v is not None else 0) for k, v in budgets.items()}
    
    # Prepare data for charts
    expenses_by_category = {}
    expenses_by_month = {}
    
    for expense in expenses:
        # Aggregate expenses by category
        category = expense['category']
        amount = float(expense['amount'])
        expenses_by_category[category] = expenses_by_category.get(category, 0) + amount
        
        # Aggregate expenses by month
        month = datetime.strptime(expense['date'], '%Y-%m-%d').strftime('%B')
        expenses_by_month[month] = expenses_by_month.get(month, 0) + amount
    
    return render_template(
        "dashboard.html", 
        expenses=expenses, 
        budgets=safe_budgets,
        expenses_by_category=expenses_by_category,
        expenses_by_month=expenses_by_month
    )

@app.route("/add_expense", methods=["POST"])
def add_expense():
    """Add a new expense from the form submission"""
    date = request.form.get('date')
    category = request.form.get('category')
    amount = request.form.get('amount')
    remark = request.form.get('remark', '')

    # Validate input
    if not all([date, category, amount]):
        return redirect(url_for('dashboard'))

    # Create expense entry
    new_expense = {
        'id': generate_unique_id(expenses),
        'date': date,
        'category': category,
        'amount': float(amount),
        'remark': remark,
    }

    # Append the new expense
    expenses.append(new_expense)
    save_data(EXPENSES_FILE, expenses)

    return redirect(url_for('dashboard'))

@app.route("/set_budget", methods=["POST"])
def set_budget():
    """Set or update budget for a category"""
    category = request.form.get('category')
    budget_amount = request.form.get('budget')

    if not all([category, budget_amount]):
        return redirect(url_for('dashboard'))

    # Update or add budget for the category
    budgets[category] = float(budget_amount)
    save_data(BUDGETS_FILE, budgets)

    return redirect(url_for('dashboard'))

@app.route("/delete_expense", methods=["POST"])
def delete_expense():
    """Delete an expense by its ID"""
    expense_id = request.form.get('id')
    
    try:
        expense_id = int(expense_id)
        # Find and remove the expense with the matching ID
        expenses[:] = [exp for exp in expenses if exp['id'] != expense_id]
        
        # Update the IDs to ensure consistency
        for i, exp in enumerate(expenses):
            exp['id'] = i
        
        save_data(EXPENSES_FILE, expenses)
    except (ValueError, TypeError):
        pass

    return redirect(url_for('dashboard'))

@app.route("/get_expenses", methods=["GET"])
def get_expenses():
    """API endpoint to retrieve expenses"""
    return jsonify(expenses)

@app.route("/get_budgets", methods=["GET"])
def get_budgets():
    """API endpoint to retrieve budgets"""
    return jsonify(budgets)

if __name__ == "__main__":
    app.run(debug=True)