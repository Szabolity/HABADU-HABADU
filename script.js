const flame = document.getElementById('flame');
const message = document.querySelector('.message');
const birthdaySong = document.getElementById('birthdaySong');

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
                message.textContent = "HABADU HABADU ATE KU! 🎉";
                
                  confetti({
                    particleCount: 100,
                    spread: 70,
                    gravity: 3, 
                    origin: { x: 0.5, y: 0.6 }, 
                });

                birthdaySong.play();

                const duration = 1 * 1000;
                const end = Date.now() + duration;
                (function frame() {
                    if (Date.now() < end) {
                        requestAnimationFrame(frame);
                    }
                })();
            }

            requestAnimationFrame(detectBlow);
        }

        detectBlow();
    })
    .catch((error) => {
        console.error('Error accessing microphone:', error);
        message.textContent = "open mu miccc";
    });
