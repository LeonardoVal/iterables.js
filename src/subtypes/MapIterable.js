/**
 */
class MapIterable extends Iterable {
	constructor (map) {
		if (!(map instanceof Map)) {
			throw new TypeError('Argument must be a `Map`, but is a `['+ 
				typeof map +' '+ map.constructor.name +']`!');
		}
		super(map);
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

} // class MapIterable

exports.MapIterable = MapIterable;