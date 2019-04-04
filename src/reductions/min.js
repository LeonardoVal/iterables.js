/** `min(n=Infinity)` returns the minimum of all numbers in the sequence, or `Infinity` if the 
sequence is empty.
*/
Iterable.prototype.min = function min(n) {
	n = isNaN(n) ? Infinity : +n;
	return this.reduce(function (n1, n2) {
		return Math.min(n1, n2);
	}, n);
};
