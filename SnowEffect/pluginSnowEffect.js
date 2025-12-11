// pluginSnowEffect.js
// Winter snow effect with mobile support

$(document).ready(function () {
    // Plugin info
    const PLUGIN_NAME = 'Snow Effect';
    const PLUGIN_VERSION = '1.2';
    const PLUGIN_AUTHOR = 'antonioag95';
    
    console.log(`❄️ ${PLUGIN_NAME} v${PLUGIN_VERSION} by ${PLUGIN_AUTHOR} loaded`);
    
    // Configuration
    const snowConfig = {
        density: 0.15,              // Snowflakes per pixel width (0.1-0.5 recommended)
        speed: 1.0,                 // Base falling speed multiplier
        windSensitivity: 0.5,       // Mouse/touch wind effect strength (0 to disable)
        size: { min: 1.0, max: 4.0 }, // Snowflake size range in pixels
        color: "255, 255, 255",     // RGB color values
        opacity: 0.4,               // Base opacity (0.0-1.0)
        zIndex: 2147483647          // Maximum z-index for visibility
    };

    const COOKIE_NAME = "snow_plugin_enabled";
    let animationFrameId = null;
    let canvas, ctx;
    let flakes = [];
    let width, height;
    let wind = 0;
    let isRunning = false;

    // Cookie management
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

    // Snowflake class
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
            this.opacity = (sizeRatio * snowConfig.opacity) + 0.2;
            
            this.swing = Math.random() * 2; 
            this.swingStep = Math.random() * 0.02 + 0.01;
            this.swingCounter = Math.random() * Math.PI * 2;
        }

        update() {
            this.y += this.speed;
            this.swingCounter += this.swingStep;
            
            const windEffect = wind * (3 / this.size); 
            this.x += Math.sin(this.swingCounter) * 0.5 + windEffect;

            if (this.x > width + 5) this.x = -5;
            if (this.x < -5) this.x = width + 5;

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
        const count = Math.floor(width * snowConfig.density);
        for (let i = 0; i < count; i++) {
            flakes.push(new Snowflake());
        }
    }

    function animate() {
        if (!canvas || !ctx || !isRunning) return;
        
        ctx.clearRect(0, 0, width, height);
        
        flakes.forEach(flake => {
            flake.update();
            flake.draw();
        });

        animationFrameId = requestAnimationFrame(animate);
    }

    function resizeCanvas() {
        if (!canvas) return;
        
        width = window.innerWidth || document.documentElement.clientWidth;
        height = window.innerHeight || document.documentElement.clientHeight;
        
        canvas.width = width;
        canvas.height = height;
        
        initFlakes();
    }

    function startSnow() {
        if (isRunning || $('#xmas-snow-canvas').length > 0) {
            return;
        }

        canvas = document.createElement('canvas');
        canvas.id = 'xmas-snow-canvas';
        
        canvas.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            pointer-events: none !important;
            z-index: ${snowConfig.zIndex} !important;
            touch-action: none !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        `;
        
        document.body.appendChild(canvas);

        ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        resizeCanvas();
        isRunning = true;

        $(window).on('resize.snow orientationchange.snow', resizeCanvas);

        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                        ('ontouchstart' in window);
        
        if (isMobile) {
            $(document).on('touchmove.snow', function(e) {
                if (snowConfig.windSensitivity === 0) return;
                const touch = e.originalEvent.touches[0];
                const center = width / 2;
                const dist = touch.clientX - center;
                const targetWind = (dist / center) * snowConfig.windSensitivity;
                wind = wind + (targetWind - wind) * 0.1;
            });
        } else {
            $(document).on('mousemove.snow', function(e) {
                if (snowConfig.windSensitivity === 0) return;
                const center = width / 2;
                const dist = e.clientX - center;
                const targetWind = (dist / center) * snowConfig.windSensitivity;
                wind = wind + (targetWind - wind) * 0.1;
            });
        }

        animate();
    }

    function stopSnow() {
        isRunning = false;
        
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        
        $(window).off('resize.snow orientationchange.snow');
        $(document).off('mousemove.snow touchmove.snow');
        
        $('#xmas-snow-canvas').remove();
        canvas = null;
        ctx = null;
        flakes = [];
    }

    function updateState() {
        const cookieVal = getCookie(COOKIE_NAME);
        const isEnabled = cookieVal === null ? true : (cookieVal === "true");

        if (isEnabled) startSnow();
        else stopSnow();
    }

    function injectToggle() {
        const $container = $('.modal-panel-content .auto');
        
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
            
            $('#snow-effect-toggle').on('change', function() {
                const checked = $(this).is(':checked');
                setCookie(COOKIE_NAME, checked, 365);
                updateState();
            });
        }
    }

    // Initialize
    updateState();

    // Immediate check in case modal already exists
    injectToggle();

    // Watch for settings modal with MutationObserver
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) {
                    if ($(node).find('.modal-panel-content').length > 0 || 
                        $(node).hasClass('modal') ||
                        $(node).closest('#myModal').length > 0) {
                        // Small delay to ensure modal content is fully rendered
                        setTimeout(injectToggle, 50);
                    }
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Fallback: also check when modal becomes visible
    $(document).on('click', '.settings', function() {
        setTimeout(injectToggle, 100);
    });

});