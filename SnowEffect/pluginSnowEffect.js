// pluginSnowEffect.js

$(document).ready(function () {
    // =========================================================================
    // ❄️ SNOW CONFIGURATION
    // =========================================================================
    const snowConfig = {
        density: 0.15,          // 0.1 to 0.5
        speed: 1.0,             // 1.0 is normal
        windSensitivity: 0.5,
        size: { min: 1.0, max: 4.0 },
        color: "255, 255, 255",
        opacity: 0.4,           // Slightly increased for visibility
        zIndex: 99999,          // Very high to ensure visibility
    };

    const COOKIE_NAME = "snow_plugin_enabled";
    let animationFrameId = null;
    let canvas, ctx;
    let flakes = [];
    let width, height;
    let wind = 0;

    // =========================================================================
    // 🍪 COOKIE HELPERS
    // =========================================================================
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // =========================================================================
    // ❄️ SNOW ENGINE
    // =========================================================================
    class Snowflake {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : -10;
            this.size = Math.random() * (snowConfig.size.max - snowConfig.size.min) + snowConfig.size.min;
            this.speed = ((this.size / snowConfig.size.max) * 1.5 * snowConfig.speed) + (Math.random() * 0.5);
            
            const sizeRatio = this.size / snowConfig.size.max;
            this.opacity = (sizeRatio * snowConfig.opacity) + 0.1;
            
            this.swing = Math.random() * 2; 
            this.swingStep = Math.random() * 0.02 + 0.01;
            this.swingCounter = Math.random() * Math.PI * 2;
        }

        update() {
            this.y += this.speed;
            this.swingCounter += this.swingStep;
            
            // Wind calc
            const windEffect = wind * (3 / this.size); 
            this.x += Math.sin(this.swingCounter) * 0.5 + windEffect;

            // Wrap X
            if (this.x > width + 5) this.x = -5;
            if (this.x < -5) this.x = width + 5;

            // Wrap Y (Floor)
            if (this.y > height) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${snowConfig.color}, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initFlakes() {
        flakes = [];
        // Recalculate based on current width
        const count = Math.floor(window.innerWidth * snowConfig.density);
        for (let i = 0; i < count; i++) {
            flakes.push(new Snowflake());
        }
    }

    function animate() {
        if (!canvas) return;
        ctx.clearRect(0, 0, width, height);
        
        flakes.forEach(flake => {
            flake.update();
            flake.draw();
        });

        animationFrameId = requestAnimationFrame(animate);
    }

    function startSnow() {
        if ($('#xmas-snow-canvas').length > 0) return; // Already exists

        console.log("❄️ Starting Snow Effect...");

        // Create Canvas using jQuery
        canvas = document.createElement('canvas');
        canvas.id = 'xmas-snow-canvas';
        
        // CSS Styles
        $(canvas).css({
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: snowConfig.zIndex
        });

        $('body').append(canvas);

        ctx = canvas.getContext('2d');
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        initFlakes();

        // Listeners
        $(window).on('resize.snow', function() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initFlakes();
        });

        $(document).on('mousemove.snow', function(e) {
            if (snowConfig.windSensitivity === 0) return;
            const center = width / 2;
            const dist = e.clientX - center;
            const targetWind = (dist / center) * snowConfig.windSensitivity;
            wind = wind + (targetWind - wind) * 0.1;
        });

        animate();
    }

    function stopSnow() {
        console.log("❄️ Stopping Snow Effect...");
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        $(window).off('resize.snow');
        $(document).off('mousemove.snow');
        $('#xmas-snow-canvas').remove();
        canvas = null;
    }

    // =========================================================================
    // ⚙️ UI INJECTION (The "Watcher" Method)
    // =========================================================================
    
    function updateState() {
        const cookieVal = getCookie(COOKIE_NAME);
        // Default to TRUE if cookie is missing
        const isEnabled = cookieVal === null ? true : (cookieVal === "true");

        if (isEnabled) startSnow();
        else stopSnow();
    }

    function injectToggle() {
        // Find the container for switches (specifically inside the modal)
        const $container = $('.modal-panel-content .auto');
        
        // If container exists AND our toggle doesn't exist yet
        if ($container.length > 0 && $('#snow-effect-toggle').length === 0) {
            
            const cookieVal = getCookie(COOKIE_NAME);
            const isChecked = cookieVal === null ? true : (cookieVal === "true");

            const html = `
            <div class="form-group" id="snow-plugin-container">
                <div class="switch flex-container flex-phone flex-phone-column flex-phone-center">
                    <input type="checkbox" tabindex="0" id="snow-effect-toggle" aria-label="Snow Effect" ${isChecked ? 'checked' : ''} />
                    <label for="snow-effect-toggle"></label>
                    <span class="text-smaller text-uppercase text-bold color-4 p-10">Winter Snow</span>
                </div>
            </div>
            `;
            
            $container.append(html);
            
            // Bind Change Event
            $('#snow-effect-toggle').on('change', function() {
                const checked = $(this).is(':checked');
                setCookie(COOKIE_NAME, checked, 365);
                updateState();
            });
            
            console.log("❄️ Settings toggle injected.");
        }
    }

    // =========================================================================
    // 🚀 INIT
    // =========================================================================
    
    // 1. Start the visual effect immediately based on cookie
    updateState();

    // 2. Start a poller to watch for the Settings Modal
    // This is necessary because the webserver might destroy/recreate the modal content
    setInterval(injectToggle, 1000);

});