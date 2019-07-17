/**
 */
class Iterable extends AbstractIterable {
	/**
	 */
	constructor (source) {
		super(source);
	}

	/** `isAsync` returns `false` for `Iterable`.
	 */
	get isAsync() {
		return false;
	}

	/** All `Iterable` instances are (of course) _iterable_, hence they have a
	 * `Symbol.iterator` method that returns an iterator.
	 */
	[Symbol.iterator](){
		let source = this.source,
			iterator = typeof source === 'function' ? source() 
				: source[Symbol.iterator]();
		return this.constructor.__iter__(iterator);
	}

	/** A `filteredMap` makes a new sequence. For each value in this sequence
	 * the `checkFunction` is called. If it returns `true`, the `valueFunction`
	 * is called. The results are yielded in the same order. 
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
		return result; //FIXME Should forEach return something?
	}

// Builders ////////////////////////////////////////////////////////////////////

	/**
	 */
	range(from, to, step) {
		let source = generators.range.bind(generators, from, to, step);
		return new this.constructor(source);
	}

	/**
	 */
	enumFromThenTo(from, then, to) {
		let source = generators.enumFromThenTo.bind(generators, from, to, 
			step);
		return new this.constructor(source);
	}

	/**
	 */
	enumFromThen(from, then) {
		let source = generators.enumFromThenTo.bind(generators, from, to);
		return new this.constructor(source);
	}

	/**
	 */
	enumFrom(from) {
		let source = generators.enumFromThenTo.bind(generators, from);
		return new this.constructor(source);
	}

	/**
	 */
	repeat(value, n) {
		let source = generators.repeat.bind(generators, value, n);
		return new this.constructor(source);
	}

	/**
	 */
	iterate(f, arg, n) {
		let source = generators.iterate.bind(generators, f, arg, n);
		return new this.constructor(generators.iterate, f, arg, n);
	}

	/** `scanl(seq, foldFunction, initial)` folds the elements of this iterable 
	 * with `foldFunction` as a left associative operator. Instead of returning 
	 * the last result, it iterates over the intermediate values in the folding 
	 * sequence.
	 */
	scanl(foldFunction, initial) {
		let source = generators.scanl.bind(generators, this, foldFunction, 
			initial);
		return new this.constructor(source);
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
		let sortedArray = this.toArray().sort(sortFunction);
		return this.constructor.fromArray(sortedArray);
	}

	/** `reverse()` returns an iterable with this iterable elements in reverse
	 * order. 
	 * 
	 * Warning! It stores all this iterable's elements in memory.
	 */
	reverse() {
		let reversedArray = this.toArray().reverse();
		return this.constructor.fromArray(reversedArray);
	}

	/** `buffered(array)` stores all elements of the iterable in an `array` and
	 * returns it as an iterable.
	 */
	buffered(array) {
		array = array || [];
		let source = generators.buffered.bind(generators, this, array);
		return new this.constructor(source);
	}

	/** `cycle(n = +Infinity)` returns an iterable that loops `n` times (or 
	 * forever by default) over the elements of this `Iterable`.
	 */
	cycle(n = +Infinity) {
		let source = generators.cycle.bind(generators, this, n);
		return new Iterable(source);
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

	/** `product(iterables...)` builds an iterable that iterates over the 
	 * [cartesian product](http://en.wikipedia.org/wiki/Cartesian_product) of 
	 * this and all the given iterables, yielding an array of the values of
	 * each.
	 */
	static product(...iterables) {
		let source = generators.product.bind(generators, ...iterables);
		return new Iterable(source);
	}

	/** 
	 */
	static concat(...iterables) {
		let source = generators.concat.bind(generators, ...iterables);
		return new Iterable(source);
	}
} // class Iterable

exports.Iterable = Iterable;
