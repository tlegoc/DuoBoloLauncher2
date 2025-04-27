const {invoke} = window.__TAURI__.core;

let gameDisplay;
let cubeDisplay;

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
        console.log("User data:", userData);

        // Example: Update the UI with some user info if needed
        gameDisplay.textContent = userData.matchCount;
        cubeDisplay.textContent = userData.totalCubesDropped;
    } catch (error) {
        console.error("Failed to fetch user data:", error);
    }
});