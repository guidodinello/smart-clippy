import "@/app.css";
import { mount } from "svelte";
import Options from "@/entrypoints/options/Options.svelte";

export default defineUnlistedScript(() => {
    mount(Options, { target: document.getElementById("app")! });
});
