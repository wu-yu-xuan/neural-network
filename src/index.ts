import createTrainingData from "./createTrainingData";
import NeuralNetwork from "./NeuralNetwork";

function main() {
  const trainingDataArray = createTrainingData({
    project: (input) => [10 * input[0]],
    randomInput: () => [Number(Math.random().toFixed(1))],
    length: 10,
  });

  const neuralNetwork = new NeuralNetwork({
    trainingDataArray,
    layers: [16, 16],
    learnRate: 0.01,
    trainCount: 100,
  });

  neuralNetwork.train();

  console.log("the result of 0.0123 * 10 is ", neuralNetwork.calc([0.0123]));
}

main();
