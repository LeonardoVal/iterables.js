import Iterable from '../Iterable';

/** Class for representing sequences based on a string, as a whole or in part.
 * 
 * @augments Iterable
 */
export class StringIterable extends Iterable {
	/** The constructor takes a string as a source, and optionally the indices
	 * of a slice of it.
	 * 
	 * @param {string} string - The string to be used as a source of the
	 * 	sequence.
	 * @param {integer} [indexFrom=0] - The starting index of the slice of the 
	 * 	string to be used.
	 * @param {integer} [indexTo=+Infinity] - The ending index of the slice of 
	 * 	the string to be used.
	 * @throws {TypeError} Raises an error if the given source is not a string.
	*/
	constructor (string, indexFrom = 0, indexTo = Infinity) {
		if (typeof string !== 'string') {
			throw new TypeError('Argument must be a string, but is a `'+ 
				typeof string +'`!');
		}
		super(string);
		this.__indexFrom__ = isNaN(indexFrom) ? 0 : Math.max(0, +indexFrom);
		this.__indexTo__ = isNaN(indexTo) ? Infinity : Math.max(0, +indexTo);
	}

	/** @inheritdoc */
	[Symbol.iterator]() {
		let iter;
		if (this.__indexFrom__ === 0 && this.__indexTo__ >= this.source.length) {
			iter = this.source[Symbol.iterator]();
		} else {
			iter = (function *(string, indexFrom, indexTo) {
				for (let i = indexFrom; i < indexTo; i++) {
					yield string.charAt(i);
				}
			})(this.source, this.__indexFrom__, this.__indexTo__);
		}
		return Iterable.__iter__(iter);
	}

// Properties //////////////////////////////////////////////////////////////////

	/** @inheritdoc */
	isEmpty() {
		return this.length === 0;
	}

	/** @inheritdoc */
	get length() {
		return Math.max(0, Math.min(this.source.length, this.__indexTo__) -
			this.__indexFrom__);
	}

// Selections //////////////////////////////////////////////////////////////////

	/** @inheritdoc */
	get(index, defaultValue) {
		let found = index >= 0 && index < this.length;
		if (!found && arguments.length < 2) {
			throw new Error(`Cannot get value at ${index}!`);
		}
		return found ? this.source.charAt(index + this.__indexFrom__) : defaultValue;
	}

} // class StringIterable
