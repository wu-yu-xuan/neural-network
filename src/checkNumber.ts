export default function checkNumber(num: number | number[]) {
  const _num = Array.isArray(num) ? num : [num];

  _num.forEach((n) => {
    if (Math.abs(n) > Number.MAX_SAFE_INTEGER || !isFinite(n) || isNaN(n)) {
      debugger;
      throw new Error(`学不会了嘤嘤嘤`);
    }
  });
}
