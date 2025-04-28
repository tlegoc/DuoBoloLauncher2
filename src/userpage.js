const {invoke} = window.__TAURI__.core;

// import from script imported in html
import {getAchievements} from "./achievements.js";

let gameDisplay;
let cubeDisplay;

let achievementTemplate;

window.addEventListener("DOMContentLoaded", async () => {
    gameDisplay = document.querySelector("#game-count");
    cubeDisplay = document.querySelector("#cube-count");

    // get token
    let token = await invoke("get_token");

    let url = await invoke("get_api_url");

    try {
        // Fetch user data
        let response = await fetch(`${url}/user`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let userData = await response.json();

        // Example: Update the UI with some user info if needed
        gameDisplay.textContent = userData.matchCount;
        cubeDisplay.textContent = userData.totalCubesDropped;

        userData.achievements.forEach(index => {
            let achievement = getAchievements()[index];
            if (achievement) {
                let el = document.querySelector(`#${achievement.elementId}`);
                el.setAttribute("data-owned", true);
            }
        })
    } catch (error) {
        console.error("Failed to fetch user data:", error);
    }
});