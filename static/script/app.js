document.getElementById("dark-mode").addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDarkMode = document.body.classList.contains('dark');
    localStorage.setItem('darkmode', isDarkMode);
    document.querySelector('meta[name="theme-color"]').setAttribute('content', isDarkMode ? '#1a1a2e' : '#fff');
});

const nameInput = document.querySelector('#input-name');
const startScreen = document.querySelector('#start-screen');

document.querySelector('#btn-play').addEventListener('click', () => {
    if(nameInput.value.trim().length > 0)
    {
        alert('start game')
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