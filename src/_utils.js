/** @ignore */
const MAX_INTEGER = Math.pow(2, 53) - 1;

/** @ignore */
function __toBool__(x) {
	return !!x;
}

/** @ignore */
function __toNumber__(x) {
	return +x;
}

/** @ignore */
function __id__(x) {
	return x;
}

/** @ignore */
function k(value) {
	return function() { 
		return value; 
	};
}

/** @ignore */
function throwUnimplemented(methodName, typeName) {
	throw new Error(`Function \`${methodName}\` is not implemented for \`${typeName}\`!`);
}