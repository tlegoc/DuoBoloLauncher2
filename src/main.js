const {invoke} = window.__TAURI__.core;
// const WebSocket = window.__TAURI__.websocket;
const { listen } = window.__TAURI__.event;
const {getCurrentWindow} = window.__TAURI__.window;
import {PlayBtn} from "./playBtn.js";

let exitBtn;
let exitContainer;
let exitLogoutBtn;
let exitQuitBtn;
let playBtn;
let playBtnEl;
let ipDisplayElDebug;
let matchmakingListener;

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

    let playTest = document.querySelector("#play-test");
    playTest.addEventListener("click", async (e) => {
        e.preventDefault();

        const mmResult = await invoke("start_matchmaking");

        console.log(mmResult);

        // console.log("Starting mm");
        //
        // const url = await invoke("get_matchmaking_url");
        //
        // console.log("MM URL: ", url);
        //
        // ipDisplayElDebug.innerText = "Searching...";
        //
        // ws = await WebSocket.connect(url);
        //
        // ws.addListener((msg) => {
        //     console.log("Received message: ", msg);
        //
        //     // if connection closed
        //     try {
        //         const data = JSON.parse(msg.data);
        //
        //         console.log(data);
        //
        //         if (data.status === "found") {
        //             matchFound(data.ip, data.port);
        //         }
        //
        //     } catch (e) {
        //         console.log("Error while processing matchmaking message: ", e);
        //     }
        //
        // });
    });

    matchmakingListener = listen('matchmaking_message', (event) => {
        console.log(event);
    });
});

window.addEventListener("beforeunload", (event) => {
    matchmakingListener();
});

function matchFound(ip, port) {
    console.log("Displaying ip");
    ipDisplayElDebug.innerText = ip + ":" + port;
}

function matchmakingCanceledByServer(data) {
    console.log(data);
}