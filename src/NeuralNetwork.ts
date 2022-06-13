import { leakyRelu, leakyReluDerivative } from "./active";
import NeuralNetworkLayer from "./NeuralNetworkLayer";
import {
  CostFn,
  NeuralNetworkOptions,
  PrintCostOptions,
  TrainingData,
} from "./types";
import { cost as costFn, costDerivative as costDerivativeFn } from "./cost";

export default class NeuralNetwork {
  active: (x: number) => number;

  activeDerivative: (x: number) => number;

  cost: CostFn;

  trainingDataArray: TrainingData[];

  random: () => number;

  trainCount: number;

  layers: NeuralNetworkLayer[];

  learnRate: number;

  constructor({
    trainingDataArray,
    active = leakyRelu,
    activeDerivative = leakyReluDerivative,
    cost = costFn,
    costDerivative = costDerivativeFn,
    layers,
    random = Math.random,
    trainCount = 10,
    learnRate = 1,
  }: NeuralNetworkOptions) {
    this.active = active;
    this.activeDerivative = activeDerivative;
    this.cost = cost;
    this.trainingDataArray = trainingDataArray;
    this.random = random;
    this.trainCount = trainCount;
    this.learnRate = learnRate;

    this.layers = [];

    const commonLayerOptions = {
      random,
      active,
      activeDerivative,
      cost,
      costDerivative,
      learnRate,
    };

    /**
     * 输入层
     * input layer
     */
    this.layers.push(
      new NeuralNetworkLayer({
        ...commonLayerOptions,
        nodeLength: this.trainingDataArray[0].input.length,
        weightLength: 0,
      })
    );

    /**
     * 隐藏层
     * hidden layer
     */
    this.layers.push(
      ...layers.map((nodeLength, index) => {
        const weightLength =
          index === 0
            ? this.trainingDataArray[0].input.length
            : layers[index - 1];
        return new NeuralNetworkLayer({
          ...commonLayerOptions,
          nodeLength,
          weightLength,
        });
      })
    );

    /**
     * 输出层
     * output layer
     */
    this.layers.push(
      new NeuralNetworkLayer({
        ...commonLayerOptions,
        nodeLength: this.trainingDataArray[0].output.length,
        weightLength: layers[layers.length - 1],
      })
    );

    this.layers.forEach((layer, index) => {
      layer.setSibling({
        prevLayer: this.layers[index - 1],
        nextLayer: this.layers[index + 1],
      });
    });
  }

  /**
   * 前向传播
   */
  forward(input: number[]) {
    this.layers.forEach((layer, index) => {
      if (index === 0) {
        layer.setValue(input);
      } else {
        layer.forward();
      }
    });
  }

  /**
   * 反向传播。
   * Back Propagation
   */
  backward(expect: number[]) {
    /**
     * 从右往左遍历，不遍历第一层，即输入层
     */
    for (let index = this.layers.length - 1; index > 0; index--) {
      this.layers[index].backward(expect);
    }
  }

  /**
   * 公式是：每个输出的误差之和
   */
  printCost({ costArray, index }: PrintCostOptions) {
    const cost =
      costArray.reduce((acc, cost) => acc + cost, 0) / costArray.length;

    console.log(`第 ${index} 次学习结果：${cost}`);
  }

  getCost(expect: number[]) {
    const cost = this.layers[this.layers.length - 1]
      .getValue()
      .reduce((acc, actual, index) => {
        return acc + this.cost({ expect: expect[index], actual });
      }, 0);

    return cost;
  }

  /**
   * 学习训练函数
   */
  train() {
    for (let index = 0; index < this.trainCount; index++) {
      const costArray = this.trainingDataArray.map((trainingData) => {
        this.forward(trainingData.input);
        this.backward(trainingData.output);
        return this.getCost(trainingData.output);
      });

      this.printCost({ costArray, index });
    }
  }

  /**
   * 计算，验证成果
   */
  calc(input: number[]) {
    this.forward(input);
    return this.layers[this.layers.length - 1].getValue();
  }
}
