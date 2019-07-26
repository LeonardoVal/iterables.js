/** Class for representing sequences based on a `Map` instance, i.e. a sequence
 * of `[key, value]` pairs.
 * 
 * @see Iterable
 */
class MapIterable extends Iterable {
	/** The constructor takes a `Map` instance as a source.
	 * 
	 * @param {Map} map - The `Map` instance to be used as a source of the
	 * 	sequence.
	 * @throws {TypeError} Raises an error if the given source is not a `Map`
	 * 	instance.
	*/
	constructor (map) {
		if (!(map instanceof Map)) {
			throw new TypeError('Argument must be a `Map`, but is a `['+ 
				typeof map +' '+ map.constructor.name +']`!');
		}
		super(map);
	}

	/** @inheritdoc */
	[Symbol.iterator]() {
		return this.source[Symbol.iterator]();
	}

// Properties //////////////////////////////////////////////////////////////////

	/** @inheritdoc */
	isEmpty() {
		return this.source.size() < 1;
	}

	/** @inheritdoc */
	get length() {
		return this.source.size();
	}

} // class MapIterable

exports.MapIterable = MapIterable;