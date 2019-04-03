/** `max(n=-Infinity)` returns the maximum of all numbers in the sequence, or `-Infinity` if the 
sequence is empty.
*/
Iterable.prototype.max = function max(n) {
	n = isNaN(n) ? -Infinity : +n;
	return this.foldl(function (n1, n2) {
		return Math.max(n1, n2);
	}, n);
};
