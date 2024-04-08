// Link para o seu modelo fornecido pelo painel de exportação do Teachable Machine
const URL = "./placas_model/";

let model, webcam, labelContainer, maxPredictions;
let isWebcamInitialized = false; // Variável para rastrear se a webcam já foi inicializada

// Função para carregar o modelo de imagem e configurar a webcam
async function init() {
    if (isWebcamInitialized) return; // Verificar se a webcam já foi inicializada

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Carregar o modelo e metadados
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Função de conveniência para configurar uma webcam
    const flip = true; // se deve ou não virar a webcam
    webcam = new tmImage.Webcam(400, 400, flip); // largura, altura, virar
    await webcam.setup(); // solicitar acesso à webcam
    await webcam.play();
    isWebcamInitialized = true; // Marcar a webcam como inicializada

    window.requestAnimationFrame(loop);

    // anexar elementos ao DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
}

// Função para atualizar o vídeo da webcam e realizar a previsão
async function loop() {
    webcam.update(); // atualizar o quadro da webcam
    if (model) {
        await predict(); // Chamar a função de previsão somente se o modelo estiver definido
    }
    window.requestAnimationFrame(loop);
}

// Função para executar a imagem da webcam através do modelo de imagem
async function predict() {
    // prever pode receber uma imagem, vídeo ou elemento de canvas html
    const prediction = await model.predict(webcam.canvas);
    displayPrediction(prediction);
}

// Função para exibir a previsão
function displayPrediction(prediction) {
    let maxProb = 0;
    let maxName = "";
    for (let i = 0; i < maxPredictions; i++) {
        if(prediction[i].probability > maxProb) {
            maxProb = prediction[i].probability;
            maxName = prediction[i].className;
        }
    }
    const classPrediction = maxName + ": " + (maxProb * 100).toFixed(2) + "%"; // Exibindo a probabilidade em percentual
    
    // Definir o texto e adicionar uma classe para estilização via CSS
    labelContainer.innerHTML = classPrediction;
    labelContainer.classList.add('prediction-box'); // Adiciona a classe 'prediction-box'
}

// Adicionar manipulador de evento após o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', async function() {
    await init(); // Inicializar a webcam ao carregar a página
});
