/** @ignore */
export const MAX_INTEGER = (2 ** 53) - 1;

/** @ignore */
export const toBool = (x) => !!x;

/** @ignore */
export const toNumber = (x) => +x;

/** @ignore */
export const id = (x) => x;

/** @ignore */
export const k = (value) => () => value;

/** @ignore */
export const throwUnimplemented = (methodName, typeName) => {
  throw new Error(`Function \`${methodName}\` is not implemented for \`${typeName}\`!`);
};

/** @ignore */
export function factorial(n, m = 1) {
  if (Number.isNaN(n) || Number.isNaN(m)) {
    return NaN;
  }
  let r = 1;
  while (n > m) {
    r *= n;
    n -= 1;
  }
  return r;
}
