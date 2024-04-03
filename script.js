// Link para o seu modelo fornecido pelo painel de exportação do Teachable Machine
const URL = "./placas_model/";

let model, webcam, labelContainer, maxPredictions;

// Carregar o modelo de imagem e configurar a webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Carregar o modelo e metadados
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Função de conveniência para configurar uma webcam
    const flip = true; // se deve ou não virar a webcam
    webcam = new tmImage.Webcam(200, 200, flip); // largura, altura, virar
    await webcam.setup(); // solicitar acesso à webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // anexar elementos ao DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
}

async function loop() {
    webcam.update(); // atualizar o quadro da webcam
    await predict();
    window.requestAnimationFrame(loop);
}

// Executar a imagem da webcam através do modelo de imagem
async function predict() {
    // Atualizar o quadro da webcam antes de fazer a previsão
    webcam.update();
    
    // Prever pode receber uma imagem, vídeo ou elemento de canvas html
    const prediction = await model.predict(webcam.canvas);
    console.log(prediction);
    let maxProb = 0;
    let maxName = "";
    for (let i = 0; i < maxPredictions; i++) {
        if(prediction[i].probability > maxProb) {
            maxProb = prediction[i].probability;
            maxName = prediction[i].className;
        }
    }
    const classPrediction = maxName + ": " + (maxProb * 100).toFixed(2) + "%"; // Exibindo a probabilidade em percentual
    labelContainer.innerHTML = classPrediction;
}

// Chamar a função init uma vez que o documento foi completamente carregado
document.addEventListener('DOMContentLoaded', init);
