/**
 */
let SINGLETON_EmptyIterable;

/** 
 */
class EmptyIterable extends Iterable {
	constructor() {
		if (SINGLETON_EmptyIterable) {
			return SINGLETON_EmptyIterable;
		} else {
			let source = generators.empty.bind(generators);
			super(source);
			SINGLETON_EmptyIterable = this;
		}
	}

// Conversions /////////////////////////////////////////////////////////////////

	/** @inheritdoc */
	toArray(array) {
		return (array || []);
	}

	/** @inheritdoc */
	toSet(set = null) {
		return set || new Set();
	}

// Properties //////////////////////////////////////////////////////////////////

	/** @inheritdoc */
	isEmpty() {
		return true;
	}

	/** @inheritdoc */
	get length() {
		return 0;
	}

// Reductions //////////////////////////////////////////////////////////////////

	/** @inheritdoc */
	reduce(foldFunction, initial) {
		return initial;
	}

// Selections //////////////////////////////////////////////////////////////////

	/** @inheritdoc */
	get(index, defaultValue) {
		if (arguments.length < 2) {
			throw new Error(`Cannot get value at ${index}!`);
		} else {
			return defaultValue;
		}
	}

} // class EmptyIterable

exports.EmptyIterable = EmptyIterable;