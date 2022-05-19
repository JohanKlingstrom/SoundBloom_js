const file = document.getElementById('fileupload');
const container = document.getElementById('container');
const canvas = document.getElementById('canvas1');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext('2d');
let audioSource;
let analyser;

context.globalCompositeOperation = 'difference';
context.lineWidth = 4;

container.addEventListener('click', function(){
    const audio1 = document.getElementById('audio1');
    const audioContext = new AudioContext();
    audio1.play();
    audioSource = audioContext.createMediaElementSource(audio1);
    analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 512;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const barWidth = 15;
    let barHeight;
    let x;

    function animate(){
        x = 0;
        context.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray)
        requestAnimationFrame(animate);
    }
    animate(); 
})

file.addEventListener('change', function(){
    const files = this.files;
    const audio1 = document.getElementById('audio1');
    audio1.src = URL.createObjectURL(files[0]);
    audio1.load();
    audio1.play();

    const audioContext = new AudioContext();
    
    audioSource = audioContext.createMediaElementSource(audio1);
    analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 512;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const barWidth = 15;
    let barHeight;
    let x;

    function animate(){
        x = 0;
        context.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray)
        requestAnimationFrame(animate);
    }
    animate(); 
})

function drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray){
    for (let i = 0; i < bufferLength; i++){
        barHeight = dataArray[i] * 1.5;
        context.save();
        context.translate(canvas.width/2, canvas.height/2);
        context.rotate(i * 5);

        const hue = i * 0.1;

        context.strokeStyle = 'hsl(' + hue + ',100%, ' + barHeight/4 + '%)';
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(0, barHeight);
        context.stroke();
        x += barWidth;
        

        if(i > bufferLength * 0.5){
            context.beginPath();
            context.arc(0, 0, barHeight/1.5, 0, Math.PI * 2);
            context.stroke();
        }

        context.restore();
    }
}