/**
 */
class ArrayIterable extends Iterable {
	constructor (array) {
		if (!Array.isArray(array)) {
			throw new TypeError('Argument must be an array, but is a `'+ typeof array +'`!');
		}
		super(array);
	}

	[Symbol.iterator]() {
		return this.source[Symbol.iterator]();
	}

// Properties //////////////////////////////////////////////////////////////////

	/** `isEmpty()` returns if the sequence has no elements.
	 */
	isEmpty() {
		return this.source.length < 1;
	}

	/** `length` is the amount of values in the sequence.
	 */
	get length() {
		return this.source.length;
	}

// Reductions //////////////////////////////////////////////////////////////////

	/** `reduce(foldFunction, initial)` folds the elements of this iterable 
	 * with `foldFunction` as a left associative operator. The `initial` value 
	 * is used as a starting point, but if it is not defined, then the first 
	 * element in the sequence is used.
	 */
	reduce(foldFunction, initial) {
		return this.source.reduce(foldFunction, initial);
	}

} // class ArrayIterable

exports.ArrayIterable = ArrayIterable;