from flask import Flask, render_template, request, redirect, url_for
from sudoku_logic.game import generate_puzzle, validate_solution

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def login(): 
    email = request.form.get('email')
    # For now, we can just redirect to the difficulty level page
    # You can add validation or user management here later
    if email:
        return redirect(url_for('difficulty'))
    return "Login failed. Please try again."

@app.route('/play-level')
def difficulty():
    return render_template('play-level.html')

@app.route('/sudoku/<level>')
def sudoku(level):
    # Depending on the level (easy, medium, hard), fetch the appropriate sudoku puzzle
    # return f"Starting a {level} Sudoku game."
    # return render_template('sudoku.html', level=level)

    # print("level: ", level)

    # difficulty = request.args.get('difficulty', 'easy')
    # difficulty = request.args.get('difficulty', level=level)
    puzzle = generate_puzzle(level)
    return render_template('sudoku.html', puzzle=puzzle, difficulty=level)


if __name__ == '__main__':
    app.run(debug=True)
