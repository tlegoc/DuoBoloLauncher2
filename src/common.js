const {invoke} = window.__TAURI__.core;
const {getCurrentWindow} = window.__TAURI__.window;

let closeBtn;
let hideBtn;

const appWindow = getCurrentWindow();

window.addEventListener("DOMContentLoaded", () => {
    closeBtn = document.querySelector("#close-btn");

    if (closeBtn)
    {
        closeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            appWindow.close();
        });
    }


    hideBtn = document.querySelector("#hide-btn");

    if (hideBtn)
    {
        hideBtn.addEventListener("click", (e) => {
            e.preventDefault();
            appWindow.minimize();
        });
    }
});
