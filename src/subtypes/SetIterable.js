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

	/** @inheritdoc */
	[Symbol.iterator]() {
		return this.source[Symbol.iterator]();
	}

// Properties //////////////////////////////////////////////////////////////////

	/** @inheritdoc */
	has(value, equality = null) {
		return equality ? super.has(value, equality) : this.source.has(value);
	}

	/** @inheritdoc */
	isEmpty() {
		return this.length === 0;
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
