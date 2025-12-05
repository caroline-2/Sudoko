import copy
from helper import *

def revise(domains, ci, cj):
    revised = False
    to_remove = set()
    
    # Store original domain for tracking
    original_ci_domain = domains[ci].copy()

    if len(domains[cj]) == 0:  # Safety check
        return False, set()
   
    for x in domains[ci]:
        found_compatible = False
        for y in domains[cj]:
            if x != y:
                found_compatible = True
                break

        if not found_compatible:
            to_remove.add(x)
    
    if to_remove:
        revised = True
        domains[ci] -= to_remove
    
    return revised, to_remove

def get_arcs(row, col):
    neighbors = set()
    for i in range(9):
        if i != col:
            neighbors.add((row, i))  # same row
        if i != row:
            neighbors.add((i, col))  # same column
    
    start_row = (row // 3) * 3
    start_col = (col // 3) * 3
    for r in range(start_row, start_row + 3):
        for c in range(start_col, start_col + 3):
            if (r, c) != (row, col):
                neighbors.add((r, c))
    return neighbors


def arc_consistency(domains):
    from collections import deque
    queue = deque()

    history = []
    for r in range(9):
        for c in range(9):
            for neighbor in get_arcs(r, c):
                queue.append(((r, c), neighbor))

    while queue:
        (ci, cj) = queue.popleft()
        
        # Save state before revision
        ci_domain_before = domains[ci].copy()
        cj_domain_before = domains[cj].copy()
        board_before = board_from_domains(domains)

        revised, removed_values = revise(domains, ci, cj)

        if revised:
            board_after = board_from_domains(domains)
            
            history.append({
                "board_before": board_before,
                "board_after": board_after,
                "cell_1": list(ci),  # First cell (being revised)
                "cell_2": list(cj),  # Second cell (constraint source)
                "cell_1_domain_before": sorted(list(ci_domain_before)),
                "cell_1_domain_after": sorted(list(domains[ci])),
                "cell_2_domain": sorted(list(cj_domain_before)),
                "removed_values": sorted(list(removed_values)),
                "changed": True
            })

            if len(domains[ci]) == 0:
                return False, history
            
            for ck in get_arcs(ci[0], ci[1]):
                if ck != cj:
                    queue.append((ck, ci))
    
    return True, history

def arc_backtrack(domains, history=None):
    if history is None:
        history = []
    
    # Check if solved
    finished = all(len(dom) == 1 for dom in domains.values())
    if finished:
        return True, domains, history

    # Pick MRV variable
    var = select_unassigned_variable(domains)

    if var is None: 
        return False, domains, history

    r, c = var

    for val in sorted(domains[var]):
        new_domains = {k: v.copy() for k, v in domains.items()}
        new_domains[(r, c)] = {val}

        ac_result, ac_history = arc_consistency(new_domains)

        if ac_result:
            solved, final_domains, final_history = arc_backtrack(new_domains, history + ac_history)
            if solved:
                return True, final_domains, final_history
            
    return False, domains, history