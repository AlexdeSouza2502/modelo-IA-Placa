// Link para o seu modelo fornecido pelo painel de exportação do Teachable Machine
const URL = "./placas_model/";

let model, webcam, labelContainer, maxPredictions;

// Variável para rastrear se a webcam já foi inicializada
let webcamInitialized = false;

// Carregar o modelo de imagem e configurar a webcam
async function init() {
    if (!webcamInitialized) {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);

        // append elements to the DOM
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) { // and class labels
            labelContainer.appendChild(document.createElement("div"));
        }

        webcamInitialized = true; // Marcar que a webcam foi inicializada
    }
}

async function loop() {
    webcam.update(); // atualizar o quadro da webcam
    await predict();
    window.requestAnimationFrame(loop);
}

// Executar a imagem da webcam através do modelo de imagem
async function predict() {
    // prever pode receber uma imagem, vídeo ou elemento de canvas html
    const prediction = await model.predict(webcam.canvas);
    console.log(prediction);
    let maxProb = 0;
    let maxName = "";
    for (let i = 0; i < maxPredictions; i++) {
        if (prediction[i].probability > maxProb) {
            maxProb = prediction[i].probability;
            maxName = prediction[i].className;
        }
    }
    const classPrediction = maxName + ": " + (maxProb * 100).toFixed(2) + "%"; // Exibindo a probabilidade em percentual
    labelContainer.innerHTML = classPrediction;
}

// Chamar a função init uma vez que o documento foi completamente carregado
document.addEventListener('DOMContentLoaded', init);
