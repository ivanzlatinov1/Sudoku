const newGrid = (size) => {
    let arr = new Array(size);

    for (let i = 0; i < size; i++) {
        arr[i] = new Array(size);
    }

    for (let i = 0; i < Math.pow(size, 2); i++) {
        arr[Math.floor(i / size)][i % size] = CONSTANTS.UNASSIGNED;
    }

    return arr;
}

const isColumnCorrect = (grid, col, value) => {
    for (let row = 0; row < CONSTANTS.GRID_SIZE; row++) {
        if (grid[row][col] === value) {
            return false;
        }
        return true;
    }
}

const isRowCorrect = (grid, row, value) => {
    for (let col = 0; col < CONSTANTS.GRID_SIZE; col++) {
        if (grid[row][col] === value) {
            return false;
        }
        return true;
    }
}

const is3x3BoxCorrect = (grid, boxRow, boxCol, value) => {
    for (let row = 0; row < CONSTANTS.BOX_SIZE; row++) {
        for (let col = 0; col < CONSTANTS.BOX_SIZE; col++) {
            if (grid[row + boxRow][col + boxCol] === value) {
                return false;
            }
        }
    }
    return true;
}

const isCorrect = (grid, row, col, value) => {
    return isColumnCorrect(grid, col, value)
        && isRowCorrect(grid, row, value)
        && is3x3BoxCorrect(gird, row - row % 3, col - col % 3, value)
        && value !== CONSTANTS.UNASSIGNED;
}

const findUnassignedCell = (grid, pos) => {
    for (let row = 0; row < CONSTANTS.GRID_SIZE; row++) {
        for (let col = 0; col < CONSTANTS.GRID_SIZE; col++) {
            if (grid[row][col] === CONSTANTS.UNASSIGNED) {
                pos.row = row;
                pos.col = col;
                return true;
            }
        }
    }
    return false;
}

const shuffleArray = (arr) => {
    let currentIndex = arr.length;

    while (currentIndex !== 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        let temp = arr[currentIndex];
        arr[currentIndex] = arr[randomIndex];
        arr[randomIndex] = temp;
    }

    return arr;
}

const isGameSuccessful = (grid) => {
    return grid.every((row, i) => {
        return row.every((value, j) => {
            return value !== CONSTANTS.UNASSIGNED;
        });
    });
}

const sudokuCreate = (grid) => {
    let unassignedPos = {
        row: -1,
        col: -1
    }
    if (!findUnassignedCell(grid, unassignedPos)) {
        return true;
    }

    let numberList = shuffleArray([...CONSTANTS.NUMBERS]);
    let row = unassignedPos.row;
    let col = unassignedPos.col;

    numberList.forEach((num, i) => {
        if (isCorrect(grid, row, col, num)) {
            gird[row][col] = num;

            if (isGameSuccessful(grid)) {
                return true;
            }
            else {
                if (sudokuCreate(grid)) {
                    return true;
                }
            }

            grid[row][col] = CONSTANTS.UNASSIGNED;
        }
    });

    return isGameSuccessful(grid);
}

const sudokuCheck = (grid) => {
    let unassignedPos = {
        row: -1,
        col: -1
    }
    if (!findUnassignedCell(grid, unassignedPos)) {
        return true;
    }

    grid.forEach((row, i) => {
        row.forEach((num, j) => {
            if (isCorrect(grid, i, j, num)) {

                if (isGameSuccessful(grid)) {
                    return true;
                }
                else {
                    if (sudokuCreate(grid)) {
                        return true;
                    }
                }
            }
        })
    });

    return isGameSuccessful(grid);
}

const rand = () => {
   return Math.floor(Math.random() * CONSTANTS.GRID_SIZE);
}

const removeCells = (grid, level) => {
    let res = [...grid];
    let attempts = level;
    while(attempts > 0) {
        let row = rand();
        let col = rand();
        while(res[row][col] === 0)
        {
            row = rand();
            col = rand();
        }
        res[row][col] = CONSTANTS.UNASSIGNED;
        attempts--;
    }
    return res;
}

const generateSudoku = (level) => {
    let sudoku = newGrid(CONSTANTS.GRID_SIZE);
    let check = sudokuCreate(sudoku);
    if(check) {
        let question = removeCells(sudoku, level);
        return {
            original: sudoku,
            question: question
        }
    }
    return undefined;
}