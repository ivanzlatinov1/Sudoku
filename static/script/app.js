document.getElementById("dark-mode").addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDarkMode = document.body.classList.contains('dark');
    localStorage.setItem('darkmode', isDarkMode);
    document.querySelector('meta[name="theme-color"]').setAttribute('content', isDarkMode ? '#1a1a2e' : '#fff');
});

const initialize = () => {
    const darkMode = JSON.parse(localStorage.getItem('darkmode'));
    document.body.classList.add(darkMode ? 'dark' : '');
    document.querySelector('meta[name="theme-color"]').setAttribute('content', darkMode ? '#1a1a2e' : '#fff');
}

