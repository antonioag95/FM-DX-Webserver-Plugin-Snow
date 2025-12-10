// pluginSnowEffect.js

(function () {
    // =========================================================================
    // ❄️ SNOW CONFIGURATION
    // =========================================================================
    const snowConfig = {
        // Master switch
        enabled: true,

        // Quantity: Higher number = More snow.
        // 0.1 is light, 0.2 is medium, 0.5 is a blizzard.
        // It calculates based on screen width so it works on mobile too.
        density: 0.15,

        // Fall Speed: 1.0 is normal. 0.5 is slow motion. 2.0 is heavy storm.
        speed: 1.0,

        // Wind: How much the mouse movement pushes the snow.
        // 0 = No wind interaction.
        windSensitivity: 0.5,

        // Size of the flakes (in pixels)
        size: {
            min: 1.0,
            max: 4.0
        },

        // Visuals
        color: "255, 255, 255", // RGB value (White)
        opacity: 0.2,           // Max opacity of the brightest flake
        zIndex: 9999,           // 9999 = On top of everything. -1 = Background.
        pointerEvents: "none"   // "none" = Click through. "auto" = Blocks clicks.
    };
    // =========================================================================


    if (!snowConfig.enabled) return;

    function ready(fn) {
        if (document.readyState !== "loading") fn();
        else document.addEventListener("DOMContentLoaded", fn);
    }

    ready(function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.id = 'xmas-snow-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = snowConfig.pointerEvents;
        canvas.style.zIndex = snowConfig.zIndex;
        
        document.body.appendChild(canvas);

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        // Calculate count based on density setting
        const getFlakeCount = () => Math.floor(window.innerWidth * snowConfig.density);
        let snowflakeCount = getFlakeCount();

        // Mouse Wind Interaction
        let wind = 0;
        
        document.addEventListener('mousemove', (e) => {
            if (snowConfig.windSensitivity === 0) return;
            
            const center = width / 2;
            const dist = e.clientX - center;
            const targetWind = (dist / center) * snowConfig.windSensitivity;
            // Easing
            wind = wind + (targetWind - wind) * 0.1;
        });

        class Snowflake {
            constructor() {
                this.reset(true);
            }

            reset(initial = false) {
                this.x = Math.random() * width;
                this.y = initial ? Math.random() * height : -10;
                
                // Randomize size based on config
                this.size = Math.random() * (snowConfig.size.max - snowConfig.size.min) + snowConfig.size.min;
                
                // Speed depends on size (Parallax) + Config Speed
                this.speed = ((this.size / snowConfig.size.max) * 1.5 * snowConfig.speed) + (Math.random() * 0.5);
                
                // Opacity logic
                const sizeRatio = this.size / snowConfig.size.max;
                this.opacity = (sizeRatio * snowConfig.opacity) + 0.1;
                
                this.swing = Math.random() * 2; 
                this.swingStep = Math.random() * 0.02 + 0.01;
                this.swingCounter = Math.random() * Math.PI * 2;
            }

            update() {
                this.y += this.speed;
                this.swingCounter += this.swingStep;
                
                // Apply wind effect
                // Smaller flakes are affected more by wind
                const windEffect = wind * (3 / this.size); 
                this.x += Math.sin(this.swingCounter) * 0.5 + windEffect;

                // Wrap around X
                if (this.x > width + 5) this.x = -5;
                if (this.x < -5) this.x = width + 5;

                // Reset on floor hit
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

        let flakes = [];
        
        function initFlakes() {
            flakes = [];
            snowflakeCount = getFlakeCount();
            for (let i = 0; i < snowflakeCount; i++) {
                flakes.push(new Snowflake());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            flakes.forEach(flake => {
                flake.update();
                flake.draw();
            });

            requestAnimationFrame(animate);
        }

        // Handle Resize
        window.addEventListener('resize', () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            // Re-init to adjust density for new screen size
            initFlakes();
        });

        initFlakes();
        animate();
        
        console.log("❄️ Snow Plugin Loaded");
    });
})();