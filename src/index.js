
window.addEventListener("DOMContentLoaded", () => {
    let createAccountEl = document.querySelector("#login-switch");
    let signInEl = document.querySelector("#create-switch");

    createAccountEl.addEventListener("click", (event) => {
        event.preventDefault();

        document.querySelector("#login-form").style.display = "none";
        document.querySelector("#create-form").style.display = "flex";
    });

    signInEl.addEventListener("click", (event) => {
        event.preventDefault();

        document.querySelector("#create-form").style.display = "none";
        document.querySelector("#login-form").style.display = "flex";
    });
});
