import random


def is_valid(board,row,col,num):
    for r in range(9):
        if board[r][col] == num:  
            return False
    for c in range(9):
        if board[row][c] == num:  
            return False
    start_row = (row // 3) * 3
    start_col = (col // 3) * 3
    for r in range(start_row, start_row + 3):
        for c in range(start_col, start_col + 3):
            if board[r][c] == num:  
                return False
    return True

def get_neighbors_values(board, row, col):
    neighbors = []
    for r in range(9):
        if board[r][col] != 0:
            neighbors.append(board[r][col])
    for c in range(9):
        if board[row][c] != 0:
            neighbors.append(board[row][c])
    start_row = (row // 3) * 3
    start_col = (col // 3) * 3
    for r in range(start_row, start_row + 3):
        for c in range(start_col, start_col + 3):
            if board[r][c] != 0:
                neighbors.append(board[r][c])
    return set(neighbors)

def is_solvable(board):
    return backtracking(board, 0, 0)

def generate_random_board(difficulty='intermediate'):
    board = [[0] * 9 for _ in range(9)]
    for i in range(0, 9, 3):
        nums = list(range(1, 10))
        random.shuffle(nums)
        for r in range(i, i + 3):
            for c in range(i, i + 3):
                board[r][c] = nums.pop()
    
    backtracking(board, 0, 0)

    cells_to_remove = {'easy': 35, 'intermediate': 45, 'hard': 55}.get(difficulty, 45)
    
    all_positions = [(r, c) for r in range(9) for c in range(9)]
    random.shuffle(all_positions)
    
    removed_count = 0
    for r, c in all_positions:
        if removed_count >= cells_to_remove:
            break
        
        if board[r][c] != 0:
            backup = board[r][c]
            board[r][c] = 0
            
            board_copy = [row[:] for row in board]
            if is_solvable(board_copy):
                removed_count += 1
            else:
                board[r][c] = backup
    
    return board

def get_arcs(row, col):
    neighbors = set()
    for i in range(9):
        if i != col :
            neighbors.add((row, i)) #same row
        if i != row :
            neighbors.add((i, col))
    start_row = (row // 3) * 3
    start_col = (col // 3) * 3
    for r in range(start_row, start_row + 3):
        for c in range(start_col, start_col + 3):
            if (r, c) != (row, col):
                neighbors.add((r, c))
    return neighbors

def domain(board):
    domains = {}
    for r in range(9):
        for c in range(9):
            if board[r][c] != 0:
                domains[(r, c)] = {board[r][c]}
            else:
                domains[(r, c)] = set(range(1, 10))
    return domains


def backtracking(board, r=0, c=0):
    if r == 9:
        return True 
    elif c == 9:
        return backtracking(board, r + 1, 0)
    elif board[r][c] != 0:
        return backtracking(board, r, c + 1)
    else:
        for num in range(1, 10):
            if is_valid(board, r, c, num):
                board[r][c] = num
                if backtracking(board, r, c + 1):
                    return True
                board[r][c] = 0
        return False
    
def board_from_domains(domains):
    board = [[0] * 9 for _ in range(9)]
    for (r, c), dom in domains.items():
        if len(dom) == 1:
            board[r][c] = next(iter(dom))
    return board


def select_unassigned_variable(domains):
    best = None
    min_size = 10
    for (r, c), dom in domains.items():
        if 1 < len(dom) < min_size:
            min_size = len(dom)
            best = (r, c)
    return best


def serialize_domains(domains):
    serialized = {}
    for (r, c), values in domains.items():
        # Convert tuple (0, 0) -> string "0,0"
        key = f"{r},{c}" 
        # Convert set {1, 2} -> list [1, 2]
        val = list(values)
        serialized[key] = val
    return serialized