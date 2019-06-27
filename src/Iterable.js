/**
 */
class Iterable extends AbstractIterable {
	/**
	 */
	constructor (source) {
		super(source);
	}

	/**
	 */
	get isAsync() {
		return false;
	}

	/** 
	 */
	static __iter__(iterator) {
		if (iterator.return) {
			return iterator;
		} else {
			let done = false;
			return {
				next() {
					return done ? { done: true } : iterator.next();
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
		let iterator = typeof source === 'function' ? source() 
				: source[Symbol.iterator]();
		return Iterable.__iter__(iterator);
	}

	/**
	 */
	filteredMap(valueFunction, checkFunction) {
		return new Iterable(generators.filteredMap, this, valueFunction,
			checkFunction);
	}

	/**
	 */
	forEach(doFunction, ifFunction) {
		let result;
		for (result of this.filteredMap(doFunction, ifFunction)) {
			// Do nothing
		}
		return result;
	}

// Builders ////////////////////////////////////////////////////////////////////

	/**
	 */
	range(from, to, step) {
		return new this.constructor(generators.range, from, to, step);
	}

	/**
	 */
	enumFromThenTo(from, then, to) {
		return new this.constructor(generators.enumFromThenTo, from, then, to);
	}

	/**
	 */
	enumFromThen(from, then) {
		return new this.constructor(generators.enumFromThen, from, then);
	}

	/**
	 */
	enumFrom(from) {
		return new this.constructor(generators.enumFrom, from);
	}

	/**
	 */
	repeat(value, n) {
		return new this.constructor(generators.repeat, value, n);
	}

	/**
	 */
	iterate(f, arg, n) {
		return new this.constructor(generators.iterate, f, arg, n);
	}

	/** `scanl(seq, foldFunction, initial)` folds the elements of this iterable 
	 * with `foldFunction` as a left associative operator. Instead of returning 
	 * the last result, it iterates over the intermediate values in the folding 
	 * sequence.
	 */
	scanl(foldFunction, initial) {
		return new this.constructor(generators.scanl, this, foldFunction, initial);
	}

	/** 
	 */
	static fromArray(array) {
		return new ArrayIterable(array);
	}

	/** 
	 */
	static fromValues() {
		return this.fromArray(Array.prototype.slice.call(arguments));
	}

	/**
	 */
	static fromObject(obj, sortKeys) {
		return new ObjectIterable(obj, sortKeys);
	}

	/**
	 */
	static fromString(string) {
		return new StringIterable(string);
	}

// Conversions /////////////////////////////////////////////////////////////////

	/** `toArray(array=[])`: appends to `array` the elements of the sequence
	 * and returns it. If no array is given, a new one is used.
	 */
	toArray(array = null) {
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

	/** `isEmpty()` returns if the sequence has no elements.
	 */
	isEmpty() {
		for (let v in this) {
			return false;
		}
		return true;
	}

	/** `length` is the amount of values in the sequence.
	 */
	get length() {
		let result = 0;
		for (let v in this) {
			result++;
		}
		return result;
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

	/** `sorted(sortFunction)` returns an iterable that goes through this 
	 * iterable's elements in order. 
	 * 
	 * Warning! This iterable's elements are stored in memory for sorting.
	 */
	sorted(sortFunction) {
		return this.constructor.fromArray(this.toArray().sort(sortFunction));
	}

	/** `reverse()` returns an iterable with this iterable elements in reverse
	 * order. 
	 * 
	 * Warning! It stores all this iterable's elements in memory.
	 */
	reverse() {
		return this.constructor.fromArray(this.toArray().reverse());
	}

	/** `buffered(array)` stores all elements of the iterable in an `array` and
	 * returns it as an iterable.
	 */
	buffered(array) {
		array = array || [];
		return this.constructor.fromArray(this.toArray(array));
	}

// Variadic operations /////////////////////////////////////////////////////////
	
} // class Iterable

exports.Iterable = Iterable;
