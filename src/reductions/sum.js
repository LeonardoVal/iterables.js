/** `sum(n=0)` returns the sum of all numbers in the sequence, or `n` if the sequence is empty.
*/
Iterable.prototype.sum = function sum(n) {
	n = isNaN(n) ? 0 : +n;
	return this.reduce(function (n1, n2) {
		return n1 + n2;
	}, n);
};
