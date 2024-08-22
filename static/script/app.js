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

const initialize = () => {
    const darkMode = JSON.parse(localStorage.getItem('darkmode'));
    document.body.classList.add(darkMode ? 'dark' : 'light');
    document.querySelector('meta[name="theme-color"]').setAttribute('content', darkMode ? '#1a1a2e' : '#fff');

    const game = getGameInfo();

    document.querySelector('#btn-continue').style.display = game ? 'grid' : 'none';
}

initialize();