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

// Selections //////////////////////////////////////////////////////////////////

	/** `get(index, defaultValue)` returns the value at the given `index`, or
	 * `defaultValue` if there is not one.  
	 */
	get(index, defaultValue) {
		let found = index >= 0 && index < this.length;
		if (!found && arguments.length < 2) {
			throw new Error(`Cannot get value at ${index}!`);
		}
		return found ? this.source.charAt(index) : defaultValue;
	}

} // class StringIterable

exports.StringIterable = StringIterable;
