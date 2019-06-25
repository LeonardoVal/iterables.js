/**
 */
class StringIterable extends Iterable {
	constructor (string) {
		if (typeof string !== 'string') {
			throw new TypeError('Argument must be a string, but is a `'+ 
				typeof string +'`!');
		}
		super(string);
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

} // class StringIterable

exports.StringIterable = StringIterable;
