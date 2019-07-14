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
		let iter = this.source[Symbol.iterator]();
		return Iterable.__iter__(iter);
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

// Selections //////////////////////////////////////////////////////////////////

	/** `get(index, defaultValue)` returns the value at the given `index`, or
	 * `defaultValue` if there is not one.  
	 */
	get(index, defaultValue) {
		let found = index >= 0 && index < this.length;
		if (!found && arguments.length < 2) {
			throw new Error(`Cannot get value at ${index}!`);
		}
		return found ? this.source[index] : defaultValue;
	}

} // class ArrayIterable

exports.ArrayIterable = ArrayIterable;