/** @ignore */
let SINGLETON_EmptyIterable;

/** Class for representing empty sequences efficiently.
 * 
 * @see Iterable
 */
class EmptyIterable extends Iterable {
	/** The constructor actually returns a singleton, created the first time it
	 * is called.
	*/
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

	/** An empty sequence converts to an empty array.
	*/
	toArray(array) {
		return (array || []);
	}

	/** An empty sequence converts to an empty set.
	*/
	toSet(set = null) {
		return set || new Set();
	}

// Properties //////////////////////////////////////////////////////////////////

	/** An empty sequence is always empty, by definition.
	*/
	isEmpty() {
		return true;
	}

	/** An empty sequence is always zero, of course.
	*/
	get length() {
		return 0;
	}

// Reductions //////////////////////////////////////////////////////////////////

	/** All reductions of empty sequences result in the initial value.
	*/
	reduce(foldFunction, initial) {
		return initial;
	}

// Selections //////////////////////////////////////////////////////////////////

	/** Nothing can be got from an empty sequence. So `get` will always fail 
	 * unless. 
	 */
	get(index, defaultValue) {
		if (arguments.length < 2) {
			throw new Error(`Cannot get value at ${index}!`);
		} else {
			return defaultValue;
		}
	}

} // class EmptyIterable

exports.EmptyIterable = EmptyIterable;