/** `has(value)` checks if the given `value` occurs in the iterable.
 */
Iterable.prototype.has = function has(value) {
	return this.indexOf(value) >= 0;
};

/** 
 */
if (FromSetIterable) {
	FromSetIterable.prototype.has = function has(value) {
		return this.__set__.has(value);
	};
}
