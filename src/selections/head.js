/** `head(defaultValue)` returns the first element. If the sequence is empty it returns 
`defaultValue`, or raise an exception if none is given.
*/
Iterable.prototype.head = function head(defaultValue) {
	var x = __iter__(this).next();
	if (x.done) {
		if (arguments.length < 1) {
			throw new Error("Attempted to get the head of an empty list!");
		} else {
			return defaultValue;
		}
	} else {
		return x.value;
	}
};
