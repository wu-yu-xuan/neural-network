/**
 * 损失函数，又称代价函数。
 * @see https://zh.wikipedia.org/zh-tw/%E6%8D%9F%E5%A4%B1%E5%87%BD%E6%95%B0
 */

import { CostOptions } from "./types";

/**
 * 计算两者的差值。
 * 为什么不用单纯的减法？因为不收敛。
 * 为什么不用绝对值？因为不好求导。
 * 为什么要乘 0.5？因为求导后可以干掉。
 */
export function cost({ expect, actual }: CostOptions) {
  return 0.5 * Math.pow(expect - actual, 2);
}

/**
 * 对 actual 求导
 */
export function costDerivative({ expect, actual }: CostOptions) {
  return actual - expect;
}
