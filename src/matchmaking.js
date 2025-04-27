const {invoke} = window.__TAURI__.core;
const WebSocket = window.__TAURI__.websocket;
const {Command} = window.__TAURI__.shell;

let matchmakingBtn;
let matchmakingBtnText;
let matchmakingWebsocket;
let ingameoverlay;

const MMState = {
    None: 'None', Searching: 'Searching', Found: 'Found', InGame: 'InGame'
}

let currentState = MMState.None;

window.addEventListener("DOMContentLoaded", () => {
    matchmakingBtn = document.querySelector("#lol-mm-btn");
    matchmakingBtnText = document.querySelector("#lol-mm-text");
    ingameoverlay = document.querySelector("#play-overlay");
    matchmakingBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        console.log("Starting matchmaking: ", currentState);

        if (currentState == MMState.Searching) {
            matchmakingWebsocket.disconnect();
            matchmakingWebsocket = null;
            setState(MMState.None);
        } else if (currentState == MMState.None) {
            matchmakingBtn.disabled = true;
            matchmakingWebsocket = await WebSocket.connect(await invoke("get_matchmaking_url"));

            matchmakingWebsocket.addListener(matchmakingEvent);
            setState(MMState.Searching);
        } else {
            console.log("Cannot cancel matchmaking. Current state: ", currentState);
        }
    });
})

const setState = (newState) => {
    if (!MMState.hasOwnProperty(newState))
    {
        console.log("Error, state invalid");
        return;
    }

    currentState = newState;

    switch (newState) {
        case MMState.None:
            matchmakingBtn.disabled = false;
            matchmakingBtnText.innerHTML = "FIND MATCH";
            ingameoverlay.style.display = "none";
            break;
        case MMState.Searching:
            matchmakingBtn.disabled = false;
            matchmakingBtnText.innerHTML = "SEARCHING";
            ingameoverlay.style.display = "none";
            break;
        case MMState.Found:
            matchmakingBtn.disabled = true;
            matchmakingBtnText.innerHTML = "MATCH FOUND";
            ingameoverlay.style.display = "none";
            break;
        case MMState.InGame:
            matchmakingBtn.disabled = true;
            matchmakingBtnText.innerHTML = "IN GAME";
            ingameoverlay.style.display = "flex";
            break;
    }
}

const matchmakingEvent = async (msg) => {
    console.log(msg);

    if (msg.type === "Close")
    {
        return;
    }

    let data;
    try {
        data = JSON.parse(msg.data);
    } catch (e) {
        console.log(e);
        return;
    }

    if (data.status === 'found')
    {
        await matchFound();
    } else if (data.status === 'server_started')
    {
        await serverStarted(data.ip);
    }
}

const matchFound = async () => {
    if (currentState !== MMState.Searching)
    {
        console.log("Error: matchmaking state isn't Searching, had: ", currentState);
        return;
    }

    setState(MMState.Found);
}

const serverStarted = async (ip) => {
    if (currentState !== MMState.Found)
    {
        console.log("Error: matchmaking state isn't Found, had: ", currentState);
        return;
    }
    setState(MMState.InGame);
    matchmakingWebsocket.disconnect();
    matchmakingWebsocket = null;

    const command = Command.sidecar('../game/DuoBoloEngine', ["-i", ip, "-u", await invoke("get_username")]);
    await command.execute().then((result) => {
        console.log(result);
        setState(MMState.None);
    })
}