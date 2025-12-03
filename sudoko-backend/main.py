from flask import Flask, jsonify, request
from flask_cors import CORS
import copy

from arc import *
from helper import *

app = Flask(__name__)
CORS(app)

@app.route('/api/generate', methods=['GET'])
def generate():
    difficulty = request.args.get("difficulty", "intermediate")
    board = generate_random_board(difficulty)
    return jsonify({"board": board})


@app.route('/api/solve', methods=['POST'])
def solve():
    data = request.json
    board = data.get('board')
    if not board: 
        return jsonify({"error": "No board"}), 400

    solver_board = copy.deepcopy(board)

    domains = domain(solver_board)

    arc_consistency(domains)

    solved, final_domains = arc_backtrack(domains)
    final_board = board_from_domains(final_domains)

    return jsonify({
        "solved": solved,
        "solution": final_board,
    })


@app.route('/api/validate_board', methods=['POST'])
def validate():
    data = request.json
    board = data.get('board')
    errors = []
    
    # Check every cell for conflicts
    for r in range(9):
        for c in range(9):
            val = board[r][c]
            if val != 0:
                # Temporarily remove value to check if it's valid
                board[r][c] = 0
                if not is_valid(board, r, c, val):
                    errors.append(f"{r}-{c}")
                board[r][c] = val # Put it back
                
    return jsonify({"errors": errors})

if __name__ == '__main__':
    app.run(debug=True, port=5000)