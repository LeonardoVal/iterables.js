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
	[Symbol.iterator](){
		let source = this.source,
			iterator = typeof source === 'function' ? source() 
				: source[Symbol.iterator]();
		return this.constructor.__iter__(iterator);
	}

	/**
	 */
	filteredMap(valueFunction, checkFunction) {
		let source = generators.filteredMap.bind(generators, this,
			valueFunction, checkFunction);
		return new Iterable(source);
	}

	/**
	 */
	forEach(doFunction, ifFunction) {
		let result;
		for (result of this) {
			if (!ifFunction || ifFunction(value, i, iter)) {
				result = (doFunction ? doFunction(value, i, iter) : value);
			}
		}
		return result; //FIXME Should forEach return something.
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
		let source = generators.scanl
			.bind(generators, this, foldFunction, initial);
		return new this.constructor(source);
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

	/** `has(value)` checks if the given `value` occurs in the iterable.
	 */
	has(value) {
		return this.indexOf(value) >= 0;
	}

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
		for (let _ of this) {
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
			iter = this[Symbol.iterator](),
			i = 0;
		for (let entry = iter.next(); !entry.done; entry = iter.next()) {
			folded = foldFunction(folded, entry.value, i, iter);
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
	
	/** `zipWith(zipFunction, ...iterables)` builds an iterable that iterates 
	 * over all the given iterables at the same time, stopping at the first 
	 * sequence finishing. Each value in the generated sequence is made by 
	 * calling the given `zipFunction` with an array of the values of each 
	 * iterable.
	 */
	static zipWith(zipFunction, ...iterables) {
		let source = generators.zipWith.bind(generators, zipFunction, 
			...iterables);
		return new Iterable(source);
	}
} // class Iterable

exports.Iterable = Iterable;
