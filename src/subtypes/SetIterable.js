/**
 */
class SetIterable extends Iterable {
	constructor (set) {
		if (!(set instanceof Set)) {
			throw new TypeError('Argument must be a `Set`, but is a `['+ 
				typeof set +' '+ set.constructor.name +']`!');
		}
		super(set);
	}

	[Symbol.iterator]() {
		return this.source[Symbol.iterator]();
	}

// Properties //////////////////////////////////////////////////////////////////

	/** `isEmpty()` returns if the sequence has no elements.
	 */
	isEmpty() {
		return this.source.size() < 1;
	}

	/** `length` is the amount of values in the sequence.
	 */
	get length() {
		return this.source.size();
	}

} // class SetIterable

exports.SetIterable = SetIterable;
