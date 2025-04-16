const {invoke} = window.__TAURI__.core;
// const WebSocket = window.__TAURI__.websocket;
const {listen} = window.__TAURI__.event;
const {getCurrentWindow} = window.__TAURI__.window;
import {PlayBtn} from "./playBtn.js";

let exitBtn;
let exitContainer;
let exitLogoutBtn;
let exitQuitBtn;
let playBtn;
let playBtnEl;
let ipDisplayElDebug;
let unlistenToMatchmakingEvents;

const appWindow = getCurrentWindow();

let ws;

window.addEventListener("DOMContentLoaded", () => {
    exitBtn = document.querySelector("#exit-btn");
    exitContainer = document.querySelector("#exit-container");
    exitLogoutBtn = document.querySelector("#exit-disconnect-btn");
    exitQuitBtn = document.querySelector("#exit-quit-btn");
    ipDisplayElDebug = document.querySelector("#ip-display");

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

    playBtnEl.addEventListener("click", async (e) => {
        e.preventDefault();

        console.log("Play button clicked");
    });

    let playTest = document.querySelector("#lol-mm-btn");
    playTest.addEventListener("click", async (e) => {
        e.preventDefault();

        const isMatchmaking = await invoke("is_matchmaking");

        try {
            if (isMatchmaking) {
                console.log("Stopping matchmaking");

                await invoke("stop_matchmaking");

                ipDisplayElDebug.innerText = "Search";
            } else {
                console.log("Starting matchmaking");
                console.log("Started at", Date.now())

                await invoke("start_matchmaking");

                ipDisplayElDebug.innerText = "Searching";
            }
        } catch (e) {
            console.log(e);
        }
    });

    unlistenToMatchmakingEvents = listen('matchmaking_event', (event) => {
        console.log("MM Event received", event);
        ipDisplayElDebug.innerText = event.toString();
    });
});

function matchFound(ip, port) {
    console.log("Displaying ip");
    ipDisplayElDebug.innerText = ip + ":" + port;
}

function matchmakingCanceledByServer(data) {
    console.log(data);
}