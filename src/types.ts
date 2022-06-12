export interface TrainingData {
  input: number[];
  output: number[];
}

export interface NeuralNetworkOptions {
  trainingDataArray: TrainingData[];
}
