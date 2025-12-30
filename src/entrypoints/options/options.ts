import "@/app.css";
import { mount } from "svelte";
import Options from "@/entrypoints/options/Options.svelte";

const appElement = document.getElementById("app");

if (!appElement) {
    throw new Error("Failed to find app element. Cannot mount options.");
}

mount(Options, { target: appElement });
