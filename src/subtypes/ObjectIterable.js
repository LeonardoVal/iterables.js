/**
 */
class ObjectIterable extends Iterable {
	constructor (obj, sortKeys) {
		if (typeof obj !== 'object') {
			throw new TypeError('Argument must be an object, but is a `'+ 
				typeof obj +'`!');
		}
		if (!obj) {
			throw new TypeError('Argument must be an object, but is null!');
		}
		super(obj);
		let keys = Object.keys(obj);
		if (sortKeys) {
			keys.sort();
		}
		Object.defineProperty(this, 'keys', { value: keys });
	}

	[Symbol.iterator]() {
		return generators.properties(this.source, this.keys);
	}

// Properties //////////////////////////////////////////////////////////////////

	/** `isEmpty()` returns if the sequence has no elements.
	 */
	isEmpty() {
		return this.keys.length < 1;
	}

	/** `length` is the amount of values in the sequence.
	 */
	get length() {
		return this.keys.length;
	}

} // class ObjectIterable

exports.ObjectIterable = ObjectIterable;