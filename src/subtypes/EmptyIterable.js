/**
 */
const EMPTY_ITERATOR = {
	next() { 
		return { done: true };
	},
	return() {
		return { done: true };
	}
};

let SINGLETON_EmptyIterable;

class EmptyIterable extends Iterable {
	constructor() {
		if (SINGLETON_EmptyIterable) {
			return SINGLETON_EmptyIterable;
		} else {
			SINGLETON_EmptyIterable = this;
			super(undefined);
		}
	}

	[Symbol.iterator]() {
		return EMPTY_ITERATOR;
	}

// Properties //////////////////////////////////////////////////////////////////

	/** `isEmpty()` returns if the sequence has no elements.
	 */
	isEmpty() {
		return true;
	}

	/** `length` is the amount of values in the sequence.
	 */
	get length() {
		return 0;
	}

// Conversions /////////////////////////////////////////////////////////////////

	/** `toArray(array=[])`: appends to `array` the elements of the sequence 
	 * and returns it. If no array is given, a new one is used.
	 */
	toArray(array) {
		return (array || []);
	}

// Reductions //////////////////////////////////////////////////////////////////

	/** `reduce(foldFunction, initial)` folds the elements of this iterable 
	 * with `foldFunction` as a left associative operator. The `initial` value 
	 * is used as a starting point, but if it is not defined, then the first 
	 * element in the sequence is used.
	 */
	reduce(foldFunction, initial) {
		return initial;
	}

} // class EmptyIterable

exports.EmptyIterable = EmptyIterable;