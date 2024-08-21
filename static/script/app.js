const bodyEl = document.querySelector("body");
const nav = document.querySelector("nav");
const p = document.querySelector(".toggle");
const inputEl = document.querySelector("input");

inputEl.checked = JSON.parse(localStorage.getItem("mode"));

function updateColor() {
    if(inputEl.checked == true)
    {
        bodyEl.style.backgroundColor = "#1a1a2e";
        nav.style.backgroundColor = "#1a1a2e";
        p.textContent = "White mode:"
        p.style.color = "white";
    }
    else
    {
        bodyEl.style.backgroundColor = "white";
        nav.style.backgroundColor = "white";
        p.textContent = "Dark mode:"
        p.style.color = "black";
    }
}

inputEl.addEventListener("input", () => {
    updateColor();
    updateLocalStorage();
})

function updateLocalStorage() {
    localStorage.setItem("mode", JSON.stringify(inputEl.checked));
}