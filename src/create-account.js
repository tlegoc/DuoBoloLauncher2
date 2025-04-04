const { invoke } = window.__TAURI__.core;
const { getCurrentWindow } = window.__TAURI__.window;

let loginForm;
let errorMsg;

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

const validateUsername = (username) => {
    return String(username)
        .match(/^[A-Za-z_\-0-9.]+$/);
}

window.addEventListener("DOMContentLoaded", () => {
    loginForm = document.querySelector("#create-form");
    errorMsg = document.querySelector("#create-error-msg");

    // on loginform input
    loginForm.addEventListener("input", (event) => {
        event.preventDefault();

        let usernameEl = document.querySelector("#create-username");
        let passwordEl = document.querySelector("#create-password");

        let submitEl = document.querySelector("#create-submit");
        if (usernameEl.value && passwordEl.value) {
            submitEl.disabled = false; // Disable the button to prevent multiple submissions
        } else {
            submitEl.disabled = true; // Disable the button to prevent multiple submissions
        }
    });

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        errorMsg.textContent = ""; // Clear previous error message

        let usernameEl = document.querySelector("#create-username");
        let passwordEl = document.querySelector("#create-password");
        let createEmailEl = document.querySelector("#create-email");
        let submitEl = document.querySelector("#create-submit");
        let createAccountEl = document.querySelector("#create-switch");
        let username = usernameEl.value;
        let email = createEmailEl.value;
        let password = passwordEl.value;

        if (submitEl.disabled) {
            return; // Prevent multiple submissions
        }

        submitEl.disabled = true; // Disable the button to prevent multiple submissions
        createAccountEl.disabled = true; // Disable the create account button
        usernameEl.disabled = true; // Disable the username input
        createEmailEl.disabled = true; // Disable the email input
        passwordEl.disabled = true; // Disable the password input

        if (!username) {
            errorMsg.textContent = "Username is required.";

            submitEl.disabled = false; // Disable the button to prevent multiple submissions
            createAccountEl.disabled = false; // Disable the create account button
            usernameEl.disabled = false; // Disable the username input
            createEmailEl.disabled = false; // Disable the email input
            passwordEl.disabled = false; // Disable the password input
            return;
        }

        if (!validateUsername(username)) {
            errorMsg.textContent = "Invalid username. Only letters, numbers, and _- characters are allowed.";

            submitEl.disabled = false; // Disable the button to prevent multiple submissions
            createAccountEl.disabled = false; // Disable the create account button
            usernameEl.disabled = false; // Disable the username input
            createEmailEl.disabled = false; // Disable the email input
            passwordEl.disabled = false; // Disable the password input
            return;
        }

        if (!email) {
            errorMsg.textContent = "Email is required.";

            submitEl.disabled = false; // Disable the button to prevent multiple submissions
            createAccountEl.disabled = false; // Disable the create account button
            usernameEl.disabled = false; // Disable the username input
            createEmailEl.disabled = false; // Disable the email input
            passwordEl.disabled = false; // Disable the password input
            return;
        }

        if (!validateEmail(email)) {
            errorMsg.textContent = "Invalid email.";

            submitEl.disabled = false; // Disable the button to prevent multiple submissions
            createAccountEl.disabled = false; // Disable the create account button
            usernameEl.disabled = false; // Disable the username input
            createEmailEl.disabled = false; // Disable the email input
            passwordEl.disabled = false; // Disable the password input
            return;
        }

        if (!password) {
            errorMsg.textContent = "Password is required.";

            submitEl.disabled = false; // Disable the button to prevent multiple submissions
            createAccountEl.disabled = false; // Disable the create account button
            usernameEl.disabled = false; // Disable the username input
            createEmailEl.disabled = false; // Disable the email input
            passwordEl.disabled = false; // Disable the password input
            return;
        }

        try {
            const response = await invoke("create_account", { username, email, password });
            console.log("Create account response:", response);
            errorMsg.textContent = "Account created successfully.";
            errorMsg.style.color = "green";
            document.querySelector("#create-form").style.display = "none";
            document.querySelector("#login-form").style.display = "flex";

            submitEl.disabled = false; // Disable the button to prevent multiple submissions
            createAccountEl.disabled = false; // Disable the create account button
            usernameEl.disabled = false; // Disable the username input
            createEmailEl.disabled = false; // Disable the email input
            passwordEl.disabled = false; // Disable the password input
        } catch (error) {
            errorMsg.textContent = error || "An error occurred during account creation.";
            console.error("Error during account creation:", error);

            submitEl.disabled = false; // Disable the button to prevent multiple submissions
            createAccountEl.disabled = false; // Disable the create account button
            usernameEl.disabled = false; // Disable the username input
            createEmailEl.disabled = false; // Disable the email input
            passwordEl.disabled = false; // Disable the password input
        }
    });
});
