# FM-DX Webserver Plugin: Snow ❄️

A lightweight, high-performance falling snow effect for the **FM-DX Webserver** dashboard. This plugin uses HTML5 Canvas to render a cozy winter atmosphere without affecting the performance of the spectrum analyzer or the user interface.

## ✨ Features

*   **High Performance:** Uses `HTML5 Canvas` (60FPS) instead of DOM elements, ensuring smooth animations even on low-end devices.
*   **Non-Intrusive:** The snow overlay uses `pointer-events: none`, so you can click buttons, knobs, and tune frequencies right through the snow.
*   **Parallax Depth:** Flakes vary in size, speed, and opacity to create a realistic 3D depth effect.
*   **Wind Simulation:** The snow reacts gently to mouse movements, drifting based on cursor position.
*   **Fully Configurable:** Easily adjust density, speed, size, opacity, and wind sensitivity.

## 📥 Installation

1.  **Download** this repository (Code -> Download ZIP) or the latest release.
2.  **Extract** the files.
3.  Copy the everything in your **plugin** folder.
4.  Paste it into your FM-DX Webserver plugins directory:
5.  **Restart** your webserver and enable the plugin from admin settings.

## ⚙️ Configuration

You can customize the look and feel of the snow by editing the top of `SnowEffect/pluginSnowEffect.js`.

Open the file and look for the `snowConfig` object:

```javascript
const snowConfig = {
    // Master switch to turn the effect on/off
    enabled: true,

    // Quantity of snow.
    // 0.1 = Light snow
    // 0.3 = Heavy snow
    // (Calculated based on screen width)
    density: 0.15,

    // Fall Speed Multiplier.
    // 0.5 = Slow motion
    // 1.0 = Normal
    // 2.0 = Blizzard
    speed: 1.0,

    // How much the mouse movement pushes the snow.
    // 0 = No interaction
    windSensitivity: 0.5,

    // Size of the flakes (in pixels)
    size: {
        min: 1.0,
        max: 4.0
    },

    // Visuals
    color: "255, 255, 255", // RGB value
    opacity: 0.8,           // Maximum opacity of the flakes (0.0 to 1.0)
    zIndex: 9999            // CSS Z-Index (Stacking order)
};
