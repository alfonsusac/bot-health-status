export function toNonNaNNumber<T>(val: unknown, ifNan: T) {
  const num = Number(val)
  const numm = Number.isNaN(num) ? ifNan : num
  return numm
}