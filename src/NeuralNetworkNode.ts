import checkNumber from "./checkNumber";
import NeuralNetworkLayer from "./NeuralNetworkLayer";
import { CostFn, NeuralNetworkNodeOptions, SetSiblingOptions } from "./types";

export default class NeuralNetworkNode {
  weightArray: number[];

  bias: number;

  active: (x: number) => number;

  activeDerivative: (x: number) => number;

  cost: CostFn;

  costDerivative: CostFn;

  value?: number;

  prevLayer?: NeuralNetworkLayer;

  nextLayer?: NeuralNetworkLayer;

  costValue?: number;

  activeValue?: number;

  index: number;

  learnRate: number;

  weightDeltaArray?: number[];

  biasDelta?: number;

  constructor({
    random,
    weightLength,
    active,
    activeDerivative,
    cost,
    costDerivative,
    learnRate,
    index,
  }: NeuralNetworkNodeOptions) {
    this.weightArray = new Array(weightLength).fill(random());
    this.bias = random();
    this.active = active;
    this.activeDerivative = activeDerivative;
    this.cost = cost;
    this.costDerivative = costDerivative;
    this.learnRate = learnRate;
    this.index = index;
  }

  setSibling({ prevLayer, nextLayer }: SetSiblingOptions) {
    this.prevLayer = prevLayer;
    this.nextLayer = nextLayer;
  }

  /**
   * wx + b
   */
  forward() {
    this.checkDelta();
    const inputArray = this.prevLayer?.getValue();
    if (!inputArray) {
      throw new Error(`cannot call forward on first input layer`);
    }
    const value = this.active(
      inputArray.reduce(
        (acc, input, index) => acc + this.weightArray[index] * input,
        0
      ) + this.bias
    );

    checkNumber(value);

    this.value = value;
  }

  getValue() {
    if (typeof this.value === "number") {
      return this.value;
    }
    throw new Error("请先调用forward方法");
  }

  setValue(value: number) {
    if (this.prevLayer) {
      throw new Error(`you can only set value of the first input layer`);
    }
    checkNumber(value);
    this.value = value;
  }

  /**
   * 公式：learnRate * 右一层的代价函数的偏导 * 激活函数的偏导 * 左一层的值
   * @see https://zh.m.wikipedia.org/zh-hans/%E5%8F%8D%E5%90%91%E4%BC%A0%E6%92%AD%E7%AE%97%E6%B3%95
   */
  backward(expect: number) {
    if (!this.prevLayer) {
      throw new Error(`cannot call backward on first input layer`);
    }

    /**
     * 激活函数的偏导
     */
    this.activeValue = this.activeDerivative(this.getValue());

    if (this.nextLayer) {
      /**
       * 隐藏层。
       * 公式是：【右边一层的代价函数偏导结果 乘 右边一层的激活函数偏导结果 乘 这两个节点之前的权重】的和
       */
      this.costValue = this.nextLayer.nodeArray.reduce<number>((acc, node) => {
        return (
          acc +
          node.costValue! * node.activeValue! * node.weightArray[this.index]
        );
      }, 0);
    } else {
      /**
       * 最后一层，即输出层。
       * 公式是代价函数的偏导
       */
      this.costValue = this.costDerivative({ expect, actual: this.getValue() });
    }

    checkNumber(this.costValue);

    checkNumber(this.activeValue);

    this.weightDeltaArray = this.weightArray.map((_, index) => {
      /**
       * 左一层的值
       */
      const prevValue = this.prevLayer?.getValue()[index]!;

      return (
        -1 * this.learnRate * this.costValue! * this.activeValue! * prevValue
      );
    });

    checkNumber(this.weightDeltaArray);

    this.biasDelta = -1 * this.learnRate * this.costValue! * this.activeValue!;

    checkNumber(this.biasDelta);
  }

  checkDelta() {
    if (this.weightDeltaArray) {
      this.weightArray = this.weightArray.map((weight, index) => {
        return weight + this.weightDeltaArray![index];
      });
      this.weightDeltaArray = undefined;
    }
    if (this.biasDelta !== undefined) {
      this.bias += this.biasDelta;
      this.biasDelta = undefined;
    }
  }
}
