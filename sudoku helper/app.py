for x in range(9):
    print('<tr>')
    for y in range(10):
        print(f'    <td class="sudoku-number" id="number-{x}-{y}" onclick="incNumber(this, {x}, {y})"></td>' if y != 9 else f'    <td class="sudoku-choose-number" id="sudoku-choose-number-{x}" onclick="chooseNumber(this, {x + 1})">{x + 1}</td>')
    print('</tr>')