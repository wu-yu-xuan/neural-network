/**
 * @fileoverview 激活函数
 * @see https://zh.wikipedia.org/zh-hans/%E6%BF%80%E6%B4%BB%E5%87%BD%E6%95%B0
 * @see https://zhuanlan.zhihu.com/p/80144138
 * 为什么要有激活函数？增加非线性因素，解决线性模型表达能力不足的缺陷。
 */

/**
 * S行函数。
 * 古典神经算法和新手教程中经常出现的激活函数。
 * @see https://zh.wikipedia.org/zh-tw/S%E5%9E%8B%E5%87%BD%E6%95%B0
 */
export function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

/**
 * sigmoid 的导数
 */
export function sigmoidDerivative(x: number): number {
  return sigmoid(x) * (1 - sigmoid(x));
}

/**
 * 线性整流函数。
 * 据说现代用的比较多。
 * Rectified Linear Unit。
 * @see https://zh.m.wikipedia.org/zh-hans/%E7%BA%BF%E6%80%A7%E6%95%B4%E6%B5%81%E5%87%BD%E6%95%B0
 */
export function relu(x: number): number {
  return x >= 0 ? x : 0;
}

export function reluDerivative(x: number): number {
  return x >= 0 ? 1 : 0;
}

/**
 * 带泄露线性整流函数
 */
export function leakyRelu(x: number) {
  return x >= 0 ? x : 0.01 * x;
}

export function leakyReluDerivative(x: number) {
  return x >= 0 ? 1 : 0.01;
}
