#!/usr/bin/env node
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const iconPath = join(__dirname, "../src/public/icons/skipper-icon.png");
const outputDir = join(__dirname, "../src/public/icons");

const sizes = [16, 32, 48, 128];

const icon = readFileSync(iconPath, "utf-8");

console.log("Generating PNG icons from Icon...\n");

for (const size of sizes) {
    const outputPath = join(outputDir, `icon-${size}.png`);

    // Render SVG to PNG with resIcon
    const resIcon = new Resvg(icon, {
        fitTo: {
            mode: "width",
            value: size,
        },
    });

    const pngData = resIcon.render();
    const pngBuffer = pngData.asPng();

    writeFileSync(outputPath, pngBuffer);

    console.log(`✓ Generated ${size}x${size} icon: icon-${size}.png`);
}

console.log("\n✅ All icons generated successfully!");
