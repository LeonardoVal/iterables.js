/** `lesser(evaluation)` returns an array with the elements of the iterable with lesser evaluation
(or numerical conversion by default).
*/
Iterable.prototype.lesser = function lesser(evaluation) {
	evaluation = typeof evaluation === 'function' ? evaluation : __toNumber__;
	var minEval = +Infinity,
		result = [];
	return lastFromIterator(filteredMapIterator(this, function (value) {
		var e = evaluation(value);
		if (minEval > e) {
			minEval = e;
			result = [value];
		} else if (minEval === e) {
			result.push(value);
		}
	}), result);
};
