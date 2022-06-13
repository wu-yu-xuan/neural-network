import { CreateTrainingDataOptions, TrainingData } from "./types";

/**
 * 生成训练集
 */
export default function createTrainingData({
  project,
  randomInput,
  length,
}: CreateTrainingDataOptions): TrainingData[] {
  return new Array(length).fill(0).map(() => {
    const input = randomInput();
    const output = project(input);
    return { input, output };
  });
}
