/** `EnumerationIterable` represents a sequence of numerical values, defined by
 * a first number, a step and a bound which can be included or not.
 *
 * @example <caption>Sequence: 0, 2, 4, 6, 8.</caption>
 * 	new EnumerationIterable(0, 10, 2)
 * @example <caption>Sequence: 0, 2, 4, 6, 8, 10.</caption>
 * 	new EnumerationIterable(0, 10, 2, true)
 * @example <caption>Sequence: 0, 2, 4, 6.</caption>
 * 	new EnumerationIterable(0, 7, 2)
 * @example <caption>Sequence: 5, 4, 3, 2.</caption>
 * 	new EnumerationIterable(5, 1, -1)
 * @example <caption>Sequence: 2, 3, 4, 5, 6.</caption>
 * 	new EnumerationIterable(2, 7)
 * @example <caption>Sequence: 2, 1, 0, -1.</caption>
 * 	new EnumerationIterable(2, -2) 
 * @example <caption>Unbound sequence: 0, 3, 6, 9 an so on.</caption>
 * 	new EnumerationIterable(0, NaN, 3) 
 * @example <caption>Unbound sequence: 9, 10, 11, 12 and so on.</caption>
 * 	new EnumerationIterable(9)
 * 
 * @see Iterable
 */
class EnumerationIterable extends Iterable {

	/** Creates an `EnumerationIterable`.
	 * @param {number} [numFrom=0] - The first value in the sequence.
	 * @param {number} [numTo=+Infinity|-Infinity] - The bound for the the 
	 * 	sequence. The default value depends on the sign of `step`.
	 * @param {number} [step=+1|-1] - The difference between each value of the 
	 * 	sequence. The default value depends on value of `numFrom` and `numTo`.
	 * @param {boolean} [rightInclusive=false] - Whether the bound is part of 
	 * 	the sequence or not.
	 */
	constructor (numFrom, numTo, step, rightInclusive = false) {
		numFrom = isNaN(numFrom) ? 0 : +numFrom;
		if (isNaN(step)) {
			step = isNaN(numTo) || numTo >= numFrom ? 1 : -1;
		} else {
			step = +step;
		}
		if (isNaN(numTo)) {
			numTo = step > 0 ? +Infinity : -Infinity;
		} else {
			numTo = +numTo;
		}
		let source = generators.range.bind(generators, numFrom, numTo, step,
			!!rightInclusive);
		super(source);
		this.numFrom = numFrom;
		this.numTo = numTo;
		this.step = step;
		this.rightInclusive = !!rightInclusive;
	}

// Properties //////////////////////////////////////////////////////////////////

	/** @inheritdoc */
	has(value, equality = null) {
		if (!equality && (typeof value !== 'number' || 
			this.step * (value - this.numTo) > 0 ||
			this.step * (this.numFrom - value) > 0
			)) {
			return false;
		}
		return super.has(value); //FIXME
	}

	/** @inheritdoc */
	isEmpty() {
		return this.length === 0;
	}

	/** @inheritdoc */
	get length() {
		let result = (this.numTo - this.numFrom) / this.step;
		if (Math.floor(result) !== result || this.rightInclusive) {
			result++;
		}
		return result < 0 ? 0 : Math.floor(result);
	}

// Conversions /////////////////////////////////////////////////////////////////

	/** @inheritdoc */
	slice(begin = 0, end = Infinity) {
		let newFrom = this.numFrom + this.step * begin,
			newTo = this.numFrom + this.step * (end - begin - 1);
		if (this.step > 0) {
			newTo = Math.min(this.numTo, newTo);
		} else {
			newTo = Math.max(this.numTo, newTo);
		}
		return new EnumerationIterable(newFrom, newTo, this.step, 
			this.rightInclusive);
	}

} // class EnumerationIterable

exports.EnumerationIterable = EnumerationIterable;