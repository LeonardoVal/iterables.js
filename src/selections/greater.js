/** `greater(evaluation)` returns an array with the elements of the iterable with greater evaluation
(or numerical conversion by default).
*/
Iterable.prototype.greater = function greater(evaluation) {
	evaluation = typeof evaluation === 'function' ? evaluation : __toNumber__;
	var maxEval = -Infinity,
		result = [];
	return lastFromIterator(filteredMapIterator(this, function (value) {
		var e = evaluation(value);
		if (maxEval < e) {
			maxEval = e;
			result = [value];
		} else if (maxEval === e) {
			result.push(value);
		}
	}), result);
};
