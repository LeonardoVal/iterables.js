/** @ignore */
export const MAX_INTEGER = Math.pow(2, 53) - 1;

/** @ignore */
export const __toBool__ = (x) => !!x;

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
