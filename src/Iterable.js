/**
 */
class Iterable {
	/**
	 */
	constructor (source, generator = null) {
		Object.defineProperty(this, 'source', { value: source });
		if (generator) {
			Object.defineProperty(this, 'generator', { value: generator });
		}
	}

	/**
	 */
	get isAsync() {
		return false;
	}

	/** 
	 */
	__iter__(iterator) {
		if (iterator.return) {
			return iterator;
		} else {
			let done = false;
			return {
				next() {
					return done ? { done: true } 
						: { value: iterator.next() };
				},
				return() { 
					done = true; 
					return { done: true };
				}
			};
		}
	}

	/** 
	 */
	[Symbol.iterator](){
		let source = this.generator ? this.generator(this.source)
				: this.source,
			iterator = typeof source === 'function' ? source 
				: source[Symbol.iterator]();
		return this.__iter__(iterator);
	}

	/**
	 */
	forEach(doFunction, ifFunction) {
		let iter = this[Symbol.iterator](),
			iter2 = Iterable.filteredMapIterator(iter, doFunction, ifFunction);
		return Iterable.lastValueFromIterator(iter2);
	}

// Builders ////////////////////////////////////////////////////////////////////

	/** 
	 */
	fromArray(array) {
		return new ArrayIterable(array);
	}

	/** 
	 */
	fromValues() {
		return this.fromArray(Array.prototype.slice.call(arguments));
	}

// Conversions /////////////////////////////////////////////////////////////////

	/** `toArray(array=[])`: appends to `array` the elements of the sequence
	 * and returns it. If no array is given, a new one is used.
	 */
	toArray(array) {
		if (!array) {
			array = [...this];
		} else {
			for (let v of this) {
				array.push(v);
			}
		}
		return array;
	}

// Properties //////////////////////////////////////////////////////////////////

	/** `indexOf(value, from=0)` is analogous to the array's namesake method. 
	 * Returns the first position of the given `value`, or -1 if it is not 
	 * found.
	 */
	indexOf(value, from) {
		return this.indicesOf(value, from).head(-1);
	}

// Reductions //////////////////////////////////////////////////////////////////

	/** `reduce(foldFunction, initial)` folds the elements of this iterable 
	 * with `foldFunction` as a left associative operator. The `initial` value 
	 * is used as a starting point, but if it is not defined, then the first 
	 * element in the sequence is used.
	 */
	reduce(foldFunction, initial) {
		let folded = initial,
			iter = seq[Symbol.iterator](),
			i = 0;
		for (let value of iter) {
			folded = foldFunction(folded, value, i, iter);
			i++;
		} 
		return folded;
	}

// Selections //////////////////////////////////////////////////////////////////

	/** `head(defaultValue)` returns the first element. If the sequence is 
	 * empty it returns `defaultValue`, or raise an exception if none is given.
	 */
	head(defaultValue) {
		for (let v of this) {
			return v;
		}
		if (arguments.length < 1) {
			throw new Error("Attempted to get the head of an empty list!");
		} else {
			return defaultValue;
		}
	}

	/** 
	 */
	static lastValue(seq, defaultValue) {
		let value = defaultValue,
			empty = true;
		for (value of seq) {
			empty = false;
		}
		if (empty && arguments.length < 2) {
			throw new Error("Attempted to get the last value of an empty iterator!");
		} else {
			return value;
		}
	}

	/**
	 */
	lastValue(defaultValue) {
		let iter = this[Symbol.iterator]();
		if (arguments.length < 1) {
			return Iterable.lastValue(iter);
		} else {
			return Iterable.lastValue(iter, defaultValue);
		}
	}

// Unary operations ////////////////////////////////////////////////////////////

// Variadic operations /////////////////////////////////////////////////////////
	
} // class Iterable

exports.Iterable = Iterable;
