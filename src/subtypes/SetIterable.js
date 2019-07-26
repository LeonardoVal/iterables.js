/** Class for representing sequences based on a `Set` instance.
 * 
 * @see Iterable
 */
class SetIterable extends Iterable {
	/** The constructor takes a `Set` instance as a source.
	 * 
	 * @param {Map} set - The `Set` instance to be used as a source of the
	 * 	sequence.
	 * @throws {TypeError} Raises an error if the given source is not a `Set`
	 * 	instance.
	*/
	constructor (set) {
		if (!(set instanceof Set)) {
			throw new TypeError('Argument must be a `Set`, but is a `['+ 
				typeof set +' '+ set.constructor.name +']`!');
		}
		super(set);
	}

	/** @inheritdoc */
	[Symbol.iterator]() {
		return this.source[Symbol.iterator]();
	}

// Properties //////////////////////////////////////////////////////////////////

	/** @inheritdoc */
	has(value) {
		return this.source.has(value);
	}

	/** @inheritdoc */
	isEmpty() {
		return this.source.size() < 1;
	}

	/** @inheritdoc */
	get length() {
		return this.source.size();
	}

// Selections //////////////////////////////////////////////////////////////////

	/** @inheritdoc */
	nub(equality = null) {
		if (!equality) {
			return new this.constructor(new Set(this.source));
		} else {
			return super.nub(equality);
		}
	}

} // class SetIterable

exports.SetIterable = SetIterable;
