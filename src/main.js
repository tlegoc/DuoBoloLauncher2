const {invoke} = window.__TAURI__.core;
const {getCurrentWindow} = window.__TAURI__.window;

let exitBtn;
let exitContainer;
let exitLogoutBtn;
let exitQuitBtn;
let playBtn;

class PlayBtn {
    constructor(btn) {
        this.btn = btn;
        this.enabledIntro = btn.querySelector(".lol-play-btn-enabled-intro");
        this.hoverIntro = btn.querySelector(".lol-play-btn-hover-intro");
        this.hoverLoop = btn.querySelector(".lol-play-btn-hover-loop");
        this.hoverOutro = btn.querySelector(".lol-play-btn-hover-outro");
        this.release = btn.querySelector(".lol-play-btn-release");
        this.disable(btn.disabled);

        this.onclick = null;

        if (this.enabledIntro) {
            this.enabledIntro.hidden = false;
            this.enabledIntro.currentTime = 0;
            this.enabledIntro.play();
        }

        btn.addEventListener('mouseenter', () => {
            if (this.disabled) return;
            this.hideAll();
            if (this.hoverIntro) {
                this.hoverIntro.hidden = false;
                this.hoverIntro.currentTime = 0;
                this.hoverIntro.play();
            }
            if (this.hoverLoop) {
                this.hoverLoop.hidden = false;
                this.hoverLoop.currentTime = 0;
                this.hoverLoop.play();
            }
        });

        btn.addEventListener('mouseleave', () => {
            if (this.disabled) return;
            this.hideAll();
            if (this.hoverOutro) {
                this.hoverOutro.hidden = false;
                this.hoverOutro.currentTime = 0;
                this.hoverOutro.play();
            }
        });

        btn.addEventListener('click', () => {
            if (this.disabled) return;
            this.hideAll();
            if (this.release) {
                this.release.hidden = false;
                this.release.currentTime = 0;
                this.release.play();
            }
            this.disable(true);
            if (this.onclick) this.onclick();
        });
    }

    addEventListener(event, callback) {
        this.btn.addEventListener(event, callback);
    }

    hideAll() {
        if (this.enabledIntro) {
            this.enabledIntro.hidden = true;
        }
        if (this.hoverIntro) {
            this.hoverIntro.hidden = true;
        }
        if (this.hoverLoop) {
            this.hoverLoop.hidden = true;
        }
        if (this.hoverOutro) {
            this.hoverOutro.hidden = true;
        }
        if (this.release) {
            this.release.hidden = true;
        }
    }

    disable(value) {
        this.disabled = value;
        if (this.disabled) {
            this.hideAll();
            if (this.release) {
                this.release.hidden = false;
                this.release.currentTime = 0;
                this.release.play();
            }
        } else {
            this.hideAll();
            if (this.enabledIntro) {
                this.enabledIntro.hidden = false;
                this.enabledIntro.currentTime = 0;
                this.enabledIntro.play();
            }
        }
    }
}

const appWindow = getCurrentWindow();

window.addEventListener("DOMContentLoaded", () => {
    exitBtn = document.querySelector("#exit-btn");
    exitContainer = document.querySelector("#exit-container");
    exitLogoutBtn = document.querySelector("#exit-disconnect-btn");
    exitQuitBtn = document.querySelector("#exit-quit-btn");

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

    playBtn = new PlayBtn(document.querySelector(".lol-play-btn"));
});