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

    attempts = {'easy': 35, 'intermediate': 45, 'hard': 55}.get(difficulty, 45)
    while attempts > 0:
        r = random.randint(0, 8)
        c = random.randint(0, 8)
        if board[r][c] != 0:
            backup = board[r][c]
            board[r][c] = 0
            board_copy = [row[:] for row in board]
            if not is_solvable(board_copy):
                board[r][c] = backup
            attempts -= 1
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
            if r != row and c != col:
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
                board[r][c] = 0  # Reset on backtracking
        return False
    
def is_valid_board_after_assignment(domains, row, col, num):
    board = board_from_domains(domains)
    return is_valid(board, row, col, num)

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