const URL = "./placas_model/";

let model, webcam, labelContainer, maxPredictions;

// Variável para rastrear se a webcam já foi inicializada
let webcamInitialized = false;

async function init() {
    if (!webcamInitialized) {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        const flip = true;
        webcam = new tmImage.Webcam(200, 200, flip);
        await webcam.setup();
        await webcam.play();

        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");

        // Create display elements for predictions
        for (let i = 0; i < maxPredictions; i++) {
            labelContainer.appendChild(document.createElement("div"));
        }

        webcamInitialized = true;  // Marcar que a webcam foi inicializada
    }
}

init();  // Call init() once to start the process

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

loop();  // Start the continuous loop

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

    // Update predictions in labelContainer elements
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}
