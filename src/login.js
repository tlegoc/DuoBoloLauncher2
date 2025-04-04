const { invoke } = window.__TAURI__.core;
const { getCurrentWindow } = window.__TAURI__.window;

let loginForm;
let errorMsg;

window.addEventListener("DOMContentLoaded", () => {
    loginForm = document.querySelector("#login-form");
    errorMsg = document.querySelector("#login-error-msg");

    // on loginform input
    loginForm.addEventListener("input", (event) => {
        event.preventDefault();

        let usernameEl = document.querySelector("#login-username");
        let passwordEl = document.querySelector("#login-password");

        let submitEl = document.querySelector("#login-submit");
        if (usernameEl.value && passwordEl.value) {
            submitEl.disabled = false; // Disable the button to prevent multiple submissions
        } else {
            submitEl.disabled = true; // Disable the button to prevent multiple submissions
        }
    });

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        errorMsg.textContent = ""; // Clear previous error message

        let usernameEl = document.querySelector("#login-username");
        let passwordEl = document.querySelector("#login-password");
        let submitEl = document.querySelector("#login-submit");
        let createAccountEl = document.querySelector("#login-switch");
        let username = usernameEl.value;
        let password = passwordEl.value;

        if (submitEl.disabled) {
            return; // Prevent multiple submissions
        }

        submitEl.disabled = true; // Disable the button to prevent multiple submissions
        createAccountEl.disabled = true; // Disable the create account button
        usernameEl.disabled = true; // Disable the username input
        passwordEl.disabled = true; // Disable the password input

        if (!username) {
            errorMsg.textContent = "Username is required.";

            submitEl.disabled = false; // Disable the button to prevent multiple submissions
            createAccountEl.disabled = false; // Disable the create account button
            usernameEl.disabled = false; // Disable the username input
            passwordEl.disabled = false; // Disable the password input
            return;
        }

        if (!password) {
            errorMsg.textContent = "Password is required.";

            submitEl.disabled = false; // Disable the button to prevent multiple submissions
            createAccountEl.disabled = false; // Disable the create account button
            usernameEl.disabled = false; // Disable the username input
            passwordEl.disabled = false; // Disable the password input
            return;
        }

        try {
            const response = await invoke("login", { username, password });
            console.log("Login response:", response);

            // goto main.html
            window.location.href = "main.html";
        } catch (error) {
            errorMsg.textContent = error || "An error occurred during login.";
            console.error("Error during login:", error);

            submitEl.disabled = false; // Disable the button to prevent multiple submissions
            createAccountEl.disabled = false; // Disable the create account button
            usernameEl.disabled = false; // Disable the username input
            passwordEl.disabled = false; // Disable the password input
        }
    });
});
