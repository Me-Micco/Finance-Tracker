from flask import Flask, request, jsonify, render_template
import os

app = Flask(__name__)

# File to store expenses
EXPENSE_FILE = "expenses.txt"

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/add_expense', methods=['POST'])
def add_expense():
    data = request.json
    date = data['date']
    category = data['category']
    amount = data['amount']
    monthly_budget = data['monthly_budget']
    
    with open(EXPENSE_FILE, "a") as file:
        file.write(f"{date},{category},{amount},{monthly_budget}\n")
    return jsonify({"message": "Expense added successfully!"})

@app.route('/get_expenses', methods=['GET'])
def get_expenses():
    expenses = []
    if os.path.exists(EXPENSE_FILE):
        with open(EXPENSE_FILE, "r") as file:
            for line in file:
                date, category, amount, monthly_budget = line.strip().split(',')
                expenses.append({
                    "date": date,
                    "category": category,
                    "amount": amount,
                    "monthly_budget": monthly_budget
                })
    return jsonify(expenses)

@app.route('/delete_expense', methods=['POST'])
def delete_expense():
    data = request.json
    date, category, amount, monthly_budget = data['date'], data['category'], data['amount'], data['monthly_budget']
    
    lines = []
    with open(EXPENSE_FILE, "r") as file:
        lines = file.readlines()
    with open(EXPENSE_FILE, "w") as file:
        for line in lines:
            if line.strip() != f"{date},{category},{amount},{monthly_budget}":
                file.write(line)
    
    return jsonify({"message": "Expense deleted successfully!"})

if __name__ == "__main__":
    app.run(debug=True)