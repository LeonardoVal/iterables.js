/**
 */
class EnumerationIterable extends Iterable {
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
	isEmpty() {
		return this.step > 0 ? this.numFrom > this.numTo : 
			this.numFrom < this.numTo;
	}

	/** @inheritdoc */
	get length() {
		return super.length; //FIXME
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