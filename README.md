
# FM-DX Webserver Plugin: Snow ❄️

A lightweight, high-performance falling snow effect for the **FM-DX Webserver** dashboard. This plugin uses HTML5 Canvas to render a cozy winter atmosphere without affecting the performance of the spectrum analyzer or the user interface.

## ✨ Features

*   **UI Integration:** Toggle the snow on or off directly from the webserver's **Settings** panel.
*   **Persistent Settings:** Remembers your preference via Cookies, so you don't have to turn it on/off every time you visit.
*   **High Performance:** Uses `HTML5 Canvas` (60FPS) instead of DOM elements, ensuring smooth animations even on low-end devices.
*   **Non-Intrusive:** The snow overlay uses `pointer-events: none`, so you can click buttons, knobs, and tune frequencies right through the snow.
*   **Parallax Depth:** Flakes vary in size, speed, and opacity to create a realistic 3D depth effect.
*   **Wind Simulation:** The snow reacts gently to mouse movements, drifting based on cursor position.

## 📥 Installation

1.  **Download** this repository (Code -> Download ZIP) or the latest release.
2.  **Extract** the files.
3.  Paste it into your FM-DX Webserver plugins directory:
4.  **Restart** your webserver and enable the plugin from admin settings.

## ⚙️ Configuration

While the On/Off state is handled by the UI, you can still customize the physics and look of the snow by editing `SnowEffect/pluginSnowEffect.js`.

Open the file and modify the `snowConfig` object at the top:

```javascript
const snowConfig = {
    // Quantity of snow.
    // 0.1 = Light snow, 0.5 = Blizzard
    // (Calculated automatically based on screen width)
    density: 0.15,

    // Fall Speed Multiplier.
    // 0.5 = Slow motion
    // 1.0 = Normal
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
    opacity: 0.4,           // Max opacity of the flakes
    zIndex: 99999           // Layer order (Keep high to cover everything)
};
```
