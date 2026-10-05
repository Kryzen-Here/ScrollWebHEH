/**
 * Sleep Debt Decoder - Simplified Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    const sections = document.querySelectorAll('section');
    const body = document.body;
    const orb1 = document.getElementById('orb-1');
    const orb2 = document.getElementById('orb-2');
    const cards = document.querySelectorAll('.option-card');
    const audioToggle = document.getElementById('audio-toggle');
    const audioIcon = document.getElementById('audio-icon');
    const audioText = document.getElementById('audio-text');
    const bgAudio = document.getElementById('bg-audio');

    let isMuted = true;

    // Canvas Logic
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const interactiveElements = [];

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = interactiveElements.length - 1; i >= 0; i--) {
            const el = interactiveElements[i];
            el.life -= 0.005;
            el.y -= 0.2;
            
            if (el.life <= 0) {
                interactiveElements.splice(i, 1);
                continue;
            }

            ctx.globalAlpha = el.life;
            if (el.type === 'moon') {
                drawMoon(el.x, el.y, el.size);
            } else {
                drawGlowStar(el.x, el.y, el.size);
            }
            ctx.globalAlpha = 1;
        }
        requestAnimationFrame(animate);
    }

    function drawMoon(x, y, radius) {
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#05070a';
        ctx.beginPath();
        ctx.arc(x + radius * 0.4, y - radius * 0.2, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawGlowStar(x, y, size) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'white';
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    window.addEventListener('mousedown', (e) => {
        const type = Math.random() > 0.8 ? 'moon' : 'star';
        interactiveElements.push({
            x: e.clientX,
            y: e.clientY,
            type: type,
            size: type === 'moon' ? 15 + Math.random() * 10 : 2 + Math.random() * 3,
            life: 1.0
        });
    });

    animate();

    // Intersection Observer for Sections
    const observerOptions = {
        threshold: 0.3
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                const stage = entry.target.dataset.stage;
                if (stage) {
                    updateTheme(parseInt(stage));
                } else if (entry.target.id === 'hero') {
                    updateTheme(0);
                } else if (entry.target.id === 'conclusion') {
                    updateTheme(4);
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    function updateTheme(stage) {
        body.className = stage ? `stage-${stage}` : '';
        
        if (stage === 0) {
            orb1.style.background = 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)';
            orb2.style.opacity = '1';
        } else if (stage >= 3) {
            orb1.style.background = 'radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%)';
            orb2.style.opacity = '0.3';
        }
    }

    // User Selection Logic
    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            // Scroll to next section
            const next = document.getElementById('stage-1');
            next.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Simple Audio Control
    audioToggle.addEventListener('click', () => {
        if (isMuted) {
            bgAudio.play().catch(e => console.log("Audio play blocked", e));
            isMuted = false;
            audioIcon.innerText = '🔊';
            audioText.innerText = 'Night Ambience On';
            audioToggle.style.borderColor = 'var(--accent-indigo)';
        } else {
            bgAudio.pause();
            isMuted = true;
            audioIcon.innerText = '🔇';
            audioText.innerText = 'Unmute Soundscape';
            audioToggle.style.borderColor = 'var(--glass-border)';
        }
    });

    // Reset Logic
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => {
                location.reload();
            }, 800);
        });
    }
});
