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

// Conversions /////////////////////////////////////////////////////////////////

	/** @inheritdoc */
	toSet(set = null) {
		return set ? super.toSet(set) : new Set(this.source);
	}

// Properties //////////////////////////////////////////////////////////////////

	/** @inheritdoc */
	isEmpty() {
		return this.source.length < 1;
	}

	/** @inheritdoc */
	get length() {
		return this.source.length;
	}

// Selections //////////////////////////////////////////////////////////////////

	/** @inheritdoc */
	get(index, defaultValue) {
		let found = index >= 0 && index < this.length;
		if (!found && arguments.length < 2) {
			throw new Error(`Cannot get value at ${index}!`);
		}
		return found ? this.source.charAt(index) : defaultValue;
	}

} // class StringIterable

exports.StringIterable = StringIterable;
