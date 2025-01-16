const flame = document.getElementById('flame');
const message = document.querySelector('.message');
const birthdaySong = document.getElementById('birthdaySong');
const cake = document.querySelector('.cake');

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
                    particleCount: 300,
                    spread: 90,
                    origin: { y: 0.6 }
                });

                birthdaySong.play();
                setTimeout(() => {
                    cake.remove(); 
                    const celebrantImage = document.createElement('img');
                    celebrantImage.src = 'celebrant.jpg'; 
                    celebrantImage.alt = 'Celebrant';
                    celebrantImage.style.width = '400px'; 
                    celebrantImage.style.height = '500px'; 
                    celebrantImage.style.borderRadius = '20px';
                    celebrantImage.style.objectFit = 'cover';
                    celebrantImage.style.marginTop = '150px'; 
                    celebrantImage.style.display = 'block';
                    document.body.appendChild(celebrantImage);
                },);
                const duration = 2 * 1000;
                const end = Date.now() + duration;
                (function frame() {
                    createFireworks(window.innerWidth / 2, window.innerHeight / 3);
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
