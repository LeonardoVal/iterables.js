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

// Conversions /////////////////////////////////////////////////////////////////

	/** `toArray(array=[])`: appends to `array` the elements of the sequence 
	 * and returns it. If no array is given, a new one is used.
	 */
	toArray(array) {
		return (array || []);
	}
} // class EmptyIterable

exports.EmptyIterable = EmptyIterable;