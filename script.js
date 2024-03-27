// Link para o seu modelo fornecido pelo painel de exportação do Teachable Machine
const URL = "./placas_model/";

let model, webcam, labelContainer, maxPredictions;

// Função de conveniência para configurar uma webcam
async function init() {
    // Verifica se a webcam já foi inicializada
    if (!webcam) {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        const flip = true;
        webcam = new tmImage.Webcam(200, 200, flip);
        await webcam.setup();
        await webcam.play();
        window.requestAnimationFrame(loop);

        document.getElementById("webcam-container").appendChild(webcam.canvas);
    }
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    let maxProb = 0;
    let maxName = "";
    for (let i = 0; i < maxPredictions; i++) {
        if (prediction[i].probability > maxProb) {
            maxProb = prediction[i].probability;
            maxName = prediction[i].className;
        }
    }
    const classPrediction = maxName + ": " + (maxProb * 100).toFixed(2) + "%";
    labelContainer.innerHTML = classPrediction;
}
