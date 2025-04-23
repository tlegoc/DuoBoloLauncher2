const {invoke} = window.__TAURI__.core;
// const WebSocket = window.__TAURI__.websocket;
const {getCurrentWindow} = window.__TAURI__.window;
import {PlayBtn} from "./playBtn.js";

let exitBtn;
let exitContainer;
let exitLogoutBtn;
let exitQuitBtn;
let playBtn;
let playBtnEl;
let profileBtn;
let ipDisplayElDebug;

let playContainer;
let profileContainer;

const appWindow = getCurrentWindow();

window.addEventListener("DOMContentLoaded", () => {
    exitBtn = document.querySelector("#exit-btn");
    exitContainer = document.querySelector("#exit-container");
    exitLogoutBtn = document.querySelector("#exit-disconnect-btn");
    exitQuitBtn = document.querySelector("#exit-quit-btn");
    ipDisplayElDebug = document.querySelector("#ip-display");
    profileBtn = document.querySelector("#profile-btn");

    playContainer = document.querySelector("#play-container");
    profileContainer = document.querySelector("#profile-container");

    exitBtn.addEventListener("click", (e) => {
        e.preventDefault();

        exitContainer.style.display = "flex";
    });

    // exitContainer.addEventListener("click", (e) => {
    //     exitContainer.style.display = "none";
    // });

    exitLogoutBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        try {
            const response = await invoke("logout");

            window.location.href = "index.html";
        } catch (error) {
            console.error("Error during logout:", error);
        }
    });

    exitQuitBtn.addEventListener("click", (e) => {
        e.preventDefault();

        appWindow.close();
    });

    playBtnEl = document.querySelector(".lol-play-btn")
    playBtn = new PlayBtn(playBtnEl);
    playBtn.disable(true);

    playBtnEl.addEventListener("click", async (e) => {
        e.preventDefault();

        showContainer(Container.play);
    });

    profileBtn.addEventListener("click", async (e) => {
       e.preventDefault();

       showContainer(Container.profile);
    });
});

const Container = {
    play: "play-container",
    profile: "profile-container"
}

const showContainer = (container) => {
    if (container === Container.play)
    {
        playContainer.style.display = "flex";
        profileContainer.style.display = "none";
        playBtn.disable(true);
    } else if (container === Container.profile)
    {
        profileContainer.style.display = "flex";
        playContainer.style.display = "none";
        playBtn.disable(false);
    }
}