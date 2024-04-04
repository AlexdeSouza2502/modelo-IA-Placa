const URL = "./placas_model/";

let model, webcam, labelContainer, maxPredictions;

  // Carregar o modelo de imagem e configurar a webcam
async function init() {
  const modelURL    = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model          = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

                                                // Convenience function to setup a webcam
  const  flip = true;                           // whether to flip the webcam
  webcam = new tmImage.Webcam(200, 200, flip);  // width, height, flip
  await webcam.setup();
  await webcam.play();

    // append elements to the DOM
  document.getElementById("webcam-container").appendChild(webcam.canvas);
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) { // and class labels
    labelContainer.appendChild(document.createElement("div"));
  }
}

  // Call init() only once to start the process
init();

async function loop() {
  webcam.update();  // update the webcam frame
  await predict();
  window.requestAnimationFrame(loop);
}

  // Executar a imagem da webcam através do modelo de imagem
async function predict() {
    // predict can take in an image, video or canvas html element
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
