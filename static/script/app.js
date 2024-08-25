document.getElementById("dark-mode").addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDarkMode = document.body.classList.contains('dark');
    localStorage.setItem('darkmode', isDarkMode);
    document.querySelector('meta[name="theme-color"]').setAttribute('content', isDarkMode ? '#1a1a2e' : '#fff');
});

const nameInput = document.querySelector('#input-name');
const startScreen = document.querySelector('#start-screen');

let levelIndex = 0;
let level = CONSTANTS.LEVEL[levelIndex];

document.querySelector('#btn-level').addEventListener('click', (event) => {
    levelIndex = (levelIndex + 1 > CONSTANTS.LEVEL.length - 1) ? 0 : levelIndex + 1;
    level = CONSTANTS.LEVEL[levelIndex];
    event.target.innerHTML = CONSTANTS.LEVEL_NAME[levelIndex];
})

document.querySelector('#btn-play').addEventListener('click', () => {
    if(nameInput.value.trim().length > 0)
    {
        alert(`level => ${level}`);
    }
    else
    {
        nameInput.classList.add('input-err');
        setTimeout(() => {
            nameInput.classList.remove('input-err');
            nameInput.focus();
        }, 500);
    }
});

const getGameInfo = () => JSON.parse(localStorage.getItem('game'));

const createCells = () => {
   const sudokuGrid = document.querySelector('.main-sudoku-grid');
   for(let i = 1; i <= 81; i++)
   {
        const cell = document.createElement('div');
        cell.classList.add('main-grid-cell');
        sudokuGrid.appendChild(cell);
   }
}

createCells();
const cells = document.querySelectorAll('.main-grid-cell');

const initializeGameGrid = () => {
    let index = 0;
    for(let i = 0; i < Math.pow(CONSTANTS.GRID_SIZE, 2); i++)
    {
        let row = Math.floor(i / CONSTANTS.GRID_SIZE);
        let col = i % CONSTANTS.GRID_SIZE;
        if(row  === 2 || row === 5)
        {
            cells[index].style.marginBottom = '10px';
        }
        if(col === 2 || col === 5)
        {
            cells[index].style.marginRight = '10px';
        }

        index++;
    }
}

const initializeNumbers = () => {
    const numsDiv = document.querySelector('.numbers');
    for(let i = 0; i < 9; i++)
    {
        const num = document.createElement('div');
        num.classList.add('number');
        num.textContent = i + 1;
        numsDiv.appendChild(num);
    }

    const btnDelete = document.createElement('div');
    btnDelete.classList.add('delete');
    btnDelete.id = 'btn-delete';
    btnDelete.textContent = 'X';
    numsDiv.appendChild(btnDelete);
}

const initialize = () => {
    const darkMode = JSON.parse(localStorage.getItem('darkmode'));
    document.body.classList.add(darkMode ? 'dark' : 'light');
    document.querySelector('meta[name="theme-color"]').setAttribute('content', darkMode ? '#1a1a2e' : '#fff');

    const game = getGameInfo();

    document.querySelector('#btn-continue').style.display = game ? 'grid' : 'none';

    initializeGameGrid();
    initializeNumbers();
}

initialize();