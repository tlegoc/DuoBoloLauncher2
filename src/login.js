const { invoke } = window.__TAURI__.core;
const { getCurrentWindow } = window.__TAURI__.window;

let loginForm;

window.addEventListener("DOMContentLoaded", () => {
    loginForm = document.querySelector("#login-form");

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = document.querySelector("#username").value;
        const password = document.querySelector("#password").value;

        try {
            const response = await invoke("login", { username, password });
            console.log("Login response:", response);
            // if (response) {
            //     // Redirect to the main application
            //     window.location.href = "main.html";
            // } else {
            //     alert("Login failed: " + response.message);
            // }
        } catch (error) {
            console.error("Error during login:", error);
        }
    });
});
