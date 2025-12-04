import copy
from helper import *

def revise(domains, ci, cj):
    revised = False
    to_remove = set()

    if len(domains[cj]) == 0:  # Safety check
        return False
   
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
    return revised


def arc_consistency(domains):
    queue = []
    history = []
    for r in range(9):
        for c in range(9):
            for neighbor in get_arcs(r, c):
                queue.append(((r, c), neighbor))

    while queue:
        (ci, cj) = queue.pop(0)
        before = copy.deepcopy(domains)
        revised = revise(domains, ci, cj)

        if revised:
            after = copy.deepcopy(domains)
       
            history.append({
                "revised_arc": [list(ci), list(cj)],
                "before": serialize_domains(before),
                "after": serialize_domains(after),
                "changed": revised
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

    # if var is None:
    #     board = board_from_domains(domains) 
    #     backtracking(board, 0, 0)
    #     final_domains = domain(board)   
    #     return True, final_domains, history
    if var is None: 
        return False, domains, history

    r, c = var

    for val in sorted(domains[var]):
        new_domains = copy.deepcopy(domains)
        new_domains[(r, c)] = {val}

        ac_result, ac_history = arc_consistency(new_domains)

        if ac_result:
            solved, final_domains, final_history = arc_backtrack(new_domains, history + ac_history)
            if solved:
                return True, final_domains, final_history
            
    return False, domains, history
