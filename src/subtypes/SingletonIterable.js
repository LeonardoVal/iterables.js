/**
 */
class SingletonIterable extends Iterable {
	constructor (value) {
		super(value, SingletonIterable.generator);
	}

	static *generator(value) {
		yield value;
	}

// Properties //////////////////////////////////////////////////////////////////

	/** `isEmpty()` returns if the sequence has no elements.
	 */
	isEmpty() {
		return false;
	}

	/** `length` is the amount of values in the sequence.
	 */
	get length() {
		return 1;
	}

// Conversions /////////////////////////////////////////////////////////////////

	/** `toArray(array=[])`: appends to `array` the elements of the sequence 
	 * and returns it. If no array is given, a new one is used.
	 */
	toArray(array) {
		return (array || []).concat([this.__value__]);
	}

} // class SingletonIterable

exports.SingletonIterable = SingletonIterable;