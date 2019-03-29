/** `has(value, from=0)` checks if the given `value` occurs in the iterable, optionally from a given
 * position.
 */
Iterable.prototype.has = function has(value, from) {
	return this.indexOf(value, from) >= 0;
};
