import NeuralNetworkLayer from "./NeuralNetworkLayer";

/**
 * 训练数据
 */
export interface TrainingData {
  /**
   * 输入的取值范围最好要落在激活函数的值域内。
   */
  input: number[];
  /**
   * 输出的取值范围要落在激活函数的值域内。
   */
  output: number[];
}

export interface NeuralNetworkOptions {
  /**
   * 训练数据
   */
  trainingDataArray: TrainingData[];

  /**
   * 激活函数
   */
  active?: (x: number) => number;

  /**
   * 激活函数的导数
   */
  activeDerivative?: (x: number) => number;

  /**
   * 代价函数
   */
  cost?: CostFn;

  /**
   * 代价函数的导数
   */
  costDerivative?: CostFn;

  /**
   * 隐藏层。
   * 数组的长度代表隐藏层的层数。
   * 每一项代表该层有几个节点。
   */
  layers: number[];

  /**
   * 随机算法
   */
  random?: () => number;

  /**
   * 训练次数
   */
  trainCount?: number;

  /**
   * 学习速度
   */
  learnRate?: number;
}

export interface NeuralNetworkLayerOptions
  extends Omit<NeuralNetworkNodeOptions, "index"> {
  /**
   * 节点数量
   */
  nodeLength: number;
}

export interface NeuralNetworkNodeOptions {
  random: () => number;
  /**
   * 上一层的节点数，即这个节点的权重数
   */
  weightLength: number;
  /**
   * 激活函数
   */
  active: (x: number) => number;

  /**
   * 激活函数的导数
   */
  activeDerivative: (x: number) => number;

  /**
   * 代价函数
   */
  cost: CostFn;

  /**
   * 代价函数的导数
   */
  costDerivative: CostFn;
  /**
   * 学习速度
   */
  learnRate: number;
  /**
   * 节点的位置
   */
  index: number;
}

export interface CostOptions {
  /**
   * 期望值，即训练集中的输出
   */
  expect: number;
  /**
   * 通过前向传播算出来的值
   */
  actual: number;
}

export type CostFn = (options: CostOptions) => number;

export interface SetSiblingOptions {
  /**
   * 该层的输入层
   */
  prevLayer?: NeuralNetworkLayer;
  /**
   * 该层的输出层
   */
  nextLayer?: NeuralNetworkLayer;
}

export interface PrintCostOptions {
  costArray: number[];
  /**
   * 第几次学习
   */
  index: number;
}

export interface CreateTrainingDataOptions {
  project: (input: number[]) => number[];
  randomInput: () => number[];
  length: number;
}
