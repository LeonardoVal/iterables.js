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

// Reductions //////////////////////////////////////////////////////////////////

	/** @inheritdoc */
	reduce(foldFunction, initial) {
		return this.source.reduce(foldFunction, initial);
	}

// Selections //////////////////////////////////////////////////////////////////

	/** @inheritdoc */
	get(index, defaultValue) {
		let found = index >= 0 && index < this.length;
		if (!found && arguments.length < 2) {
			throw new Error(`Cannot get value at ${index}!`);
		}
		return found ? this.source[index] : defaultValue;
	}

} // class ArrayIterable

exports.ArrayIterable = ArrayIterable;