/**
 */
class ArrayIterable extends Iterable {
	constructor (array, indexFrom = 0, indexTo = Infinity) {
		if (!Array.isArray(array)) {
			throw new TypeError('Argument must be an array, but is a `'+ typeof array +'`!');
		}
		super(array);
		this.__indexFrom__ = isNaN(indexFrom) ? 0 : Math.max(0, +indexFrom);
		this.__indexTo__ = isNaN(indexTo) ? Infinity : Math.max(0, +indexTo);
	}

	[Symbol.iterator]() {
		let iter;
		if (this.__indexFrom__ === 0 && this.__indexTo__ >= this.source.length) {
			iter = this.source[Symbol.iterator]();
		} else {
			iter = (function *(array, indexFrom, indexTo) {
				for (let i = indexFrom; i < indexTo; i++) {
					yield array[i];
				}
			})(this.source, this.__indexFrom__, this.__indexTo__);
		}
		return Iterable.__iter__(iter);
	}

// Conversions /////////////////////////////////////////////////////////////////

	/** @inheritdoc */
	toArray() {
		return this.source.slice(this.__indexFrom__, this.__indexTo__);
	}

// Properties //////////////////////////////////////////////////////////////////

	/** @inheritdoc */
	isEmpty() {
		return this.length < 1;
	}

	/** @inheritdoc */
	get length() {
		return Math.min(this.source.length, this.__indexTo__) - this.__indexFrom__;
	}

// Reductions //////////////////////////////////////////////////////////////////

	/** @inheritdoc */
	reduce(foldFunction, initial) {
		if (this.__indexFrom__ === 0 && this.__indexTo__ >= this.source.length) {
			return this.source.reduce(foldFunction, initial);
		} else {
			return super.reduce(foldFunction, initial);
		}
	}

// Selections //////////////////////////////////////////////////////////////////

	/** @inheritdoc */
	get(index, defaultValue) {
		let found = index >= 0 && index < this.length;
		if (!found && arguments.length < 2) {
			throw new Error(`Cannot get value at ${index}!`);
		}
		return found ? this.source[index + this.__indexFrom__] : defaultValue;
	}

} // class ArrayIterable

exports.ArrayIterable = ArrayIterable;