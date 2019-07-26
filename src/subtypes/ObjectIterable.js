/** Class for representing sequences based on objects, i.e. a sequence of 
 * `[key, value]` pairs taken from the object's properties.
 * 
 * @see Iterable
 */
class ObjectIterable extends Iterable {
	/** The constructor takes an object as a source.
	 * 
	 * @param {object} obj - The object instance to be used a the source of the
	 * 	sequence.
	 * @param {boolean} [sortKeys=false] - If true, the sequence is build 
	 * 	taking `obj`'s properties in lexicographical order by key.  
	 * @throws {TypeError} Raises an error if `obj` is not an object or if it 
	 * 	is null.
	*/
	constructor (obj, sortKeys = false) {
		if (typeof obj !== 'object' || !obj) {
			throw new TypeError(`Argument must be an object, but is a ${obj && typeof obj}!`);
		}
		super(obj);
		let keys = Object.keys(obj);
		if (sortKeys) {
			keys.sort();
		}
		Object.defineProperty(this, 'keys', { value: keys });
	}

	/** @inheritdoc */
	[Symbol.iterator]() {
		return generators.properties(this.source, this.keys);
	}

// Properties //////////////////////////////////////////////////////////////////

	/** @inheritdoc */
	isEmpty() {
		return this.keys.length < 1;
	}

	/** @inheritdoc */
	get length() {
		return this.keys.length;
	}

} // class ObjectIterable

exports.ObjectIterable = ObjectIterable;