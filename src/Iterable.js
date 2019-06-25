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

	/**
	 */
	fromObject(obj, sortKeys) {
		return new ObjectIterable(obj, sortKeys);
	}

	/**
	 */
	fromString(string) {
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

	/** `toObject(obj={})` takes a sequence of `[key,value]` pairs and assigns
	 * each as a property of `obj` (or a new object by default).
	 */
	toObject(obj = null) {
		obj = obj || {};
		return this.reduce((obj, [key, value]) => {
				obj[key] = pair[value];
				return obj;
			}, obj);
	}

	/** `toMap(map=new Map())` takes a sequence of `[key,value]` pairs and puts
	 * each in the given `map` (or a new one by default).
	 */
	toMap(map = null) {
		map = map || new Map();
		return this.reduce((map, [key, value]) => {
				map.set(key, value);
				return map;
			}, map);
	}

	/** `join(sep='')` concatenates all strings in the sequence using `sep` as
	 * separator. If `sep` is not given, '' is assumed.
	 */
	join(sep, prefix = '') {
		sep = ''+ sep;
		if (sep) {
			return this.reduce((accum, value) => accum + value, prefix);	
		} else {
			return this.reduce((accum, value, i) => 
				accum + ((i === 0) ? value : sep + value), prefix);
		}
	}

// Properties //////////////////////////////////////////////////////////////////

	/** `indexOf(value, from=0)` is analogous to the array's namesake method. 
	 * Returns the first position of the given `value`, or -1 if it is not 
	 * found.
	 */
	indexOf(value, from = 0) {
		return this.indicesOf(value, from).head(-1);
	}

	/** `indicesOf(value, from=0)` is a sequence of the positions of the value
	 * in this iterable.
	 */
	indicesOf(value, from = 0) {
		from = Math.floor(from) || 0;
		return this.filteredMap( 
			(_, i) => i,
			(v, i) => v === value && i >= from
		);
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
		return this.reduce((accum) => accum + 1, 0);
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

	/** `all(predicate, strict=false)` returns true if for all elements in the 
	 * sequence `predicate` returns true, or if they are all truthy if no 
	 * predicate is given. If the sequence is empty, true is returned.
	 */
	all(predicate, strict = false) {
		predicate = typeof predicate === 'function' ? predicate : __toBool__;
		return this.reduce((result, value, i, iter) => {
			if (!predicate(value, i, iter)) {
				result = false;
				if (!strict) {
					iter.return(); // Shortcircuit.
				}
			}
			return result;
		}, true);
	}

	/** `any(predicate, strict=false)` returns false if for all elements in the
	 * sequence `predicate` returns false, or if the sequence is empty.
	 */
	any(predicate, strict = false) {
		predicate = typeof predicate === 'function' ? predicate : __toBool__;
		return this.reduce((result, value, i, iter) => {
			if (predicate(value, i, iter)) {
				result = true;
				if (!strict) {
					iter.return(); // Shortcircuit.
				}
			}
			return result;
		}, false);
	}

	/** `max(n=-Infinity)` returns the maximum of all numbers in the sequence,
	 * or `-Infinity` if the sequence is empty.
	 */
	max(n) {
		n = isNaN(n) ? -Infinity : +n;
		return this.reduce((n1, n2) => Math.max(n1, n2), n);
	}

	/** `maxBy(compareFunction, defaultValue)` returns the maximum of all 
	 * numbers in the sequence, according to the given `compareFunction`, or 
	 * `defaultValue` if the sequence is empty.
	 */
	maxBy(compareFunction, defaultValue) {
		defaultValue = arguments.length < 2 ? -Infinity : defaultValue;
		return this.reduce(
			(v1, v2) => compareFunction(v1, v2) < 0 ? v2 : v1,
			defaultValue
		);
	}

	/** `min(n=Infinity)` returns the minimum of all numbers in the sequence,
	 * or `Infinity` if the sequence is empty.
	 */
	min(n) {
		n = isNaN(n) ? Infinity : +n;
		return this.reduce((n1, n2) => Math.min(n1, n2), n);
	}

	/** `minBy(compareFunction, defaultValue)` returns the maximum of all
	 * numbers in the sequence, according to the given `compareFunction`, or
	 * `defaultValue` if the sequence is empty.
	 */
	minBy(compareFunction, defaultValue) {
		defaultValue = arguments.length < 2 ? Infinity : defaultValue;
		return this.reduce(
			(v1, v2) => compareFunction(v1, v2) > 0 ? v2 : v1,
			defaultValue
		);
	}

	/** `sum(n=0)` returns the sum of all numbers in the sequence, or `n` if
	 * the sequence is empty.
	 */
	sum(n) {
		n = isNaN(n) ? 0 : +n;
		return this.reduce((n1, n2) => n1 + n2, n);
	}

// Selections //////////////////////////////////////////////////////////////////

	/** `filter(filterFunction)` returns an iterable of this iterable elements
	 * for which `condition` returns true.
	 */
	filter(condition) {
		return this.filteredMap(condition || __toBool__);
	}

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
		return Iterable.fromArray(this.toArray().sort(sortFunction));
	}

	/** `reverse()` returns an iterable with this iterable elements in reverse
	 * order. 
	 * 
	 * Warning! It stores all this iterable's elements in memory.
	 */
	reverse() {
		return Iterable.fromArray(this.toArray().reverse());
	}

	/** `buffered(array)` stores all elements of the iterable in an `array` and
	 * returns it as an iterable.
	 */
	buffered(array) {
		array = array || [];
		return Iterable.fromArray(this.toArray(array));
	}

// Variadic operations /////////////////////////////////////////////////////////
	
} // class Iterable

exports.Iterable = Iterable;
