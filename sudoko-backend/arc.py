import copy
from helper import *

def revise(domains, ci, cj):
    revised = False
    to_remove = set()
   
    for x in domains[ci]:
        found_compatible = False
        for y in domains[cj]:
            if x != y:
                found_compatible = True
                break

        if not found_compatible:
            to_remove.add(x)
            revised = True
    domains[ci] -= to_remove
    return revised


def arc_consistency(domains):
    queue = []
    for r in range(9):
        for c in range(9):
            for neighbor in get_arcs(r, c):
                queue.append(((r, c), neighbor))

    while queue:
        (ci, cj) = queue.pop(0)
        if revise(domains, ci, cj):
            if len(domains[ci]) == 0:
                return False
            for ck in get_arcs(ci[0], ci[1]):
                if ck != cj:
                    queue.append((ck, ci))
    return True


def arc_backtrack(domains):
    # Check if solved
    finished = all(len(dom) == 1 for dom in domains.values())
    if finished:
        return True, domains

    # Pick MRV variable
    var = select_unassigned_variable(domains)
    if var is None:
        return False, domains

    r, c = var
    values = list(domains[(r, c)])

    for val in values:
        new_domains = copy.deepcopy(domains)
        new_domains[(r, c)] = {val}

        if not is_valid_board_after_assignment(new_domains, r, c, val):
            continue

        if arc_consistency(new_domains):
            solved, result = arc_backtrack(new_domains)
            if solved:
                return True, result

    return False, domains
