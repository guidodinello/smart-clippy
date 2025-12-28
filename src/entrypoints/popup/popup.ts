import "@/app.css";
import { mount } from "svelte";
import Popup from "@/entrypoints/popup/Popup.svelte";

export default defineUnlistedScript(() => {
    mount(Popup, { target: document.getElementById("app")! });
});
