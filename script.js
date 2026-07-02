document.addEventListener('DOMContentLoaded', () => {
    const noBtn = document.getElementById('noBtn');
    const yesBtn = document.getElementById('yesBtn');
    const subtitle = document.getElementById('subtitle');
    const proposalScreen = document.getElementById('proposalScreen');
    const successScreen = document.getElementById('successScreen');

    let dodgeCount = 0;
    let yesScale = 1;

    const funnyMessages = [
        "'No' seems a bit shy 🙈",
        "You can't escape love! 💘",
        "The No button has trust issues 🧐",
        "It keeps running away! 🏃‍♂️",
        "Just say yes already! 💖"
    ];

    function moveNoButton() {
        // Switch to fixed positioning if not already
        if (noBtn.style.position !== 'fixed') {
            const rect = noBtn.getBoundingClientRect();
            noBtn.style.position = 'fixed';
            noBtn.style.left = `${rect.left}px`;
            noBtn.style.top = `${rect.top}px`;
            // Brief timeout to let the DOM apply the fixed style before animating
            setTimeout(calculateNewPosition, 10);
        } else {
            calculateNewPosition();
        }
    }

    function calculateNewPosition() {
        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Get button dimensions
        const btnRect = noBtn.getBoundingClientRect();
        const btnWidth = btnRect.width;
        const btnHeight = btnRect.height;

        // Calculate safe bounds (keep it inside the screen with a small margin)
        const margin = 20;
        const maxX = viewportWidth - btnWidth - margin;
        const maxY = viewportHeight - btnHeight - margin;

        // Generate random coordinates
        const randomX = Math.max(margin, Math.floor(Math.random() * maxX));
        const randomY = Math.max(margin, Math.floor(Math.random() * maxY));

        // Apply new position
        noBtn.style.left = `${randomX}px`;
        noBtn.style.top = `${randomY}px`;

        updateUIOnDodge();
    }

    function updateUIOnDodge() {
        // Update subtitle
        const randomMsg = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
        subtitle.style.opacity = 0;
        setTimeout(() => {
            subtitle.textContent = randomMsg;
            subtitle.style.opacity = 1;
        }, 150);

        // Increase Yes button size slightly (max scale around 1.5 to not overflow too much)
        dodgeCount++;
        if (yesScale < 1.6) {
            yesScale += 0.1;
            yesBtn.style.transform = `scale(${yesScale})`;
        }
    }

    // Event listeners for the No button
    noBtn.addEventListener('mouseenter', moveNoButton);
    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        moveNoButton();
    });
    // For mobile touch devices
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveNoButton();
    }, { passive: false });

    // Event listener for the Yes button
    yesBtn.addEventListener('click', () => {
        // Trigger confetti shower
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            // Confetti from two sides
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            }));
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            }));
        }, 250);

        // Hide proposal, show success
        proposalScreen.classList.add('hidden');
        successScreen.classList.remove('hidden');

        // Add entry animation to success screen
        successScreen.classList.add('card-enter');
    });
});
