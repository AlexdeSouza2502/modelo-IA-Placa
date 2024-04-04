const URL = "./placas_model/";

let model, webcam, labelContainer, maxPredictions;
let isRunning = false; // Flag to track if webcam is running

// Carregar o modelo de imagem e configurar a webcam
async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Convenience function to setup a webcam
  const flip = true;
  webcam = new tmImage.Webcam(200, 200, flip);
  await webcam.setup();
  await webcam.play();

  // append elements to the DOM
  document.getElementById("webcam-container").appendChild(webcam.canvas);
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    labelContainer.appendChild(document.createElement("div"));
  }

  isRunning = true; // Set flag to true when webcam starts
}

// Call init() only once outside any function
init(); 

const startButton = document.getElementById("startButton");

startButton.addEventListener("click", async () => {
  if (!isRunning) {
    await init(); // Re-initialize only if not running
  }
  loop();
});

async function loop() {
  if (isRunning) {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
  }
}

// Executar a imagem da webcam através do modelo de imagem
async function predict() {
  // predict can take in an image, video or canvas html element
  const prediction = await model.predict(webcam.canvas);
  console.log(prediction);
