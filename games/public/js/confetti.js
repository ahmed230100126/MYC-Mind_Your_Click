/**
 * Simple Confetti Animation System
 * For celebrating achievements and other game events
 */

const confetti = (function() {
    // Default settings
    const defaults = {
        particleCount: 100,
        spread: 70,
        startVelocity: 30,
        decay: 0.9,
        gravity: 1,
        ticks: 200,
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
        origin: { y: 0.5, x: 0.5 }
    };

    // Create a canvas for the confetti
    function createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '9999';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.appendChild(canvas);
        return canvas;
    }

    // Create a particle
    function createParticle(canvas, options) {
        const ctx = canvas.getContext('2d');
        const colors = options.colors || defaults.colors;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Particle properties
        return {
            color,
            x: options.origin.x * canvas.width,
            y: options.origin.y * canvas.height,
            size: Math.random() * 10 + 5,
            angle: Math.random() * Math.PI * 2,
            velocity: (Math.random() * options.startVelocity) - (options.startVelocity / 2),
            velocityY: Math.random() * options.startVelocity,
            velocityX: Math.random() * options.spread - (options.spread / 2),
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5,
            gravity: options.gravity,
            decay: options.decay,
            ticks: options.ticks,
            currentTick: 0
        };
    }

    // Update a particle
    function updateParticle(particle) {
        particle.currentTick++;
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
        particle.velocityY += particle.gravity;
        particle.velocityX *= particle.decay;
        particle.velocityY *= particle.decay;
        particle.rotation += particle.rotationSpeed;
        return particle.currentTick < particle.ticks;
    }

    // Draw a particle
    function drawParticle(ctx, particle) {
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation * Math.PI / 180);
        
        // Draw a confetti piece (rectangle)
        ctx.fillStyle = particle.color;
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        
        ctx.restore();
    }

    // Main function to run the confetti animation
    return function(customOptions = {}) {
        const options = { ...defaults, ...customOptions };
        const canvas = createCanvas();
        const ctx = canvas.getContext('2d');
        
        // Create particles
        const particles = [];
        for (let i = 0; i < options.particleCount; i++) {
            particles.push(createParticle(canvas, options));
        }
        
        // Animation loop
        let animationFrame = null;
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw particles
            const remainingParticles = particles.filter(particle => {
                const isAlive = updateParticle(particle);
                if (isAlive) {
                    drawParticle(ctx, particle);
                }
                return isAlive;
            });
            
            // Continue animation if there are particles left
            if (remainingParticles.length > 0) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                // Clean up
                cancelAnimationFrame(animationFrame);
                document.body.removeChild(canvas);
            }
        }
        
        // Start animation
        animationFrame = requestAnimationFrame(animate);
    };
})();

console.log("Confetti script loaded");
