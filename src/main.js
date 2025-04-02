const { invoke } = window.__TAURI__.core;
import { exit } from '@tauri-apps/api/process';

// let greetInputEl;
// let greetMsgEl;

// async function greet() {
//   // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
//   greetMsgEl.textContent = await invoke("greet", { name: greetInputEl.value });
// }

let closeBtn;

async function close()
{
  await exit(0);
}

window.addEventListener("DOMContentLoaded", () => {
  closeBtn = document.querySelector("#close-btn");
  closeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    close();
  });
});
