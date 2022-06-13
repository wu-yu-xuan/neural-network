import NeuralNetworkNode from "./NeuralNetworkNode";
import { NeuralNetworkLayerOptions, SetSiblingOptions } from "./types";

export default class NeuralNetworkLayer {
  nodeArray: NeuralNetworkNode[];

  prevLayer?: NeuralNetworkLayer;

  nextLayer?: NeuralNetworkLayer;

  constructor({ nodeLength, ...rest }: NeuralNetworkLayerOptions) {
    this.nodeArray = new Array(nodeLength).fill(0).map((_, index) => {
      return new NeuralNetworkNode({ ...rest, index });
    });
  }

  setSibling({ prevLayer, nextLayer }: SetSiblingOptions) {
    this.prevLayer = prevLayer;
    this.nextLayer = nextLayer;
    this.nodeArray.forEach((node) => {
      node.setSibling({ prevLayer, nextLayer });
    });
  }

  /**
   * 前向传播
   */
  forward() {
    this.nodeArray.forEach((node) => {
      node.forward();
    });
  }

  /**
   * 反向传播
   */
  backward(expect: number[]) {
    this.nodeArray.forEach((node, index) => {
      node.backward(expect[index]);
    });
  }

  getValue() {
    return this.nodeArray.map((x) => x.getValue());
  }

  setValue(value: number[]) {
    if (this.prevLayer) {
      throw new Error(`you can only set value of the first input layer`);
    }
    this.nodeArray.forEach((node, index) => {
      node.setValue(value[index]);
    });
  }
}
