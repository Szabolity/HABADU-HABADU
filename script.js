const flame = document.getElementById('flame');
const message = document.querySelector('.message');
const birthdaySong = document.getElementById('birthdaySong');
const fireworksCanvas = document.getElementById('fireworksCanvas');
const ctx = fireworksCanvas.getContext('2d');

fireworksCanvas.width = window.innerWidth;
fireworksCanvas.height = window.innerHeight;

let fireworks = [];

class Firework {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = Math.random() * 2 + 2;
        this.alpha = 1;
        this.speed = Math.random() * 3 + 2;
        this.angle = Math.random() * Math.PI * 2;
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.alpha -= 0.01; 
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        ctx.fill();
    }
}

function createFireworks(x, y) {
    const colors = ["255, 0, 0", "0, 255, 0", "0, 0, 255", "255, 255, 0", "255, 0, 255"];
    const color = colors[Math.floor(Math.random() * colors.length)];

    for (let i = 0; i < 50; i++) {
        fireworks.push(new Firework(x, y, color));
    }
}

function updateFireworks() {
    ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

    fireworks = fireworks.filter(firework => firework.alpha > 0);
    fireworks.forEach(firework => {
        firework.update();
        firework.draw();
    });

    requestAnimationFrame(updateFireworks);
}

navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);

        microphone.connect(analyser);

        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        function detectBlow() {
            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;
            const threshold = 50;

            if (average > threshold) {
                flame.style.opacity = 0;
                message.textContent = "HABADU HABADU ATE KUU! 🎉";

                confetti({
                    particleCount: 100, 
                    spread: 70,
                    gravity: 3, 
                    origin: { x: 0.5, y: 0.6 },
                });

                birthdaySong.play();

                const duration = 3 * 1000;
                const end = Date.now() + duration;

                (function frame() {
                    if (Date.now() < end) {
                        confetti({
                            particleCount: 15,
                            spread: 60,
                            gravity: 3,
                            origin: { x: 0.5, y: 0.6 },
                        });
                        requestAnimationFrame(frame);
                    }
                })();

                const fireworksDuration = 5 * 1000;  
                const fireworksEnd = Date.now() + fireworksDuration;

                (function fireworksFrame() {
                    createFireworks(window.innerWidth / 2, window.innerHeight / 3);

                    if (Date.now() < fireworksEnd) {
                        requestAnimationFrame(fireworksFrame);
                    }
                })();
            }
            requestAnimationFrame(detectBlow);
        }

        detectBlow();
    })
    .catch((error) => {
        console.error('Error accessing microphone:', error);
        message.textContent = "Microphone access is required to blow the candle!";
    });

updateFireworks();
