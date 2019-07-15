/**
 */
class AbstractIterable {
	/**
	 */
	constructor (source) {
		if (typeof source === 'function' && arguments.length > 1) {
			source = source.bind(Array.prototype.slice.call(arguments, 1));
		}
		Object.defineProperty(this, 'source', { value: source });
	}

	/** 
	 */
	static __iter__(iterator) {
		if (!iterator.return) {
			let done = false,
				oldNext = iterator.next.bind(iterator);
			iterator = {
				next() {
					return done ? { done: true } : oldNext();
				},
				return() { 
					done = true; 
					return { done: true };
				}
			};
		}
		return iterator;
	}

// Conversions /////////////////////////////////////////////////////////////////

	/** `map(mapFunction)` returns an iterable iterating on the results of 
	 * applying `mapFunction` to each of this iterable elements.
	 */
	map(mapFunction) {
		return this.filteredMap(mapFunction);
	}

	/** `toArray(array=[])`: appends to `array` the elements of the sequence
	 * and returns it. If no array is given, a new one is used.
	 */
	toArray(array = null) {
		array = array || [];
		return this.reduce((obj, value) => {
				array.push(value);
				return array;
			}, array);
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

	/** `toSet(set=new Set())` adds all the values in this sequence to the
	 * given `set`, or a new one by default.
	 */
	toSet(set = null) {
		set = set || new Set();
		return this.reduce((set, value) => {
				set.add(value);
				return set;
			}, set);
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

	/** `indexWhere(condition, from=0)` returns the position of the first value
	 * of this iterable that complies with the given `condition`, or -1 if 
	 * there is none.
	 */
	indexWhere(condition, from = 0) {
		return this.indicesWhere(condition, from).head(-1);
	}

	/** `indicesWhere(condition, from=0)` is a sequence of the positions in 
	 * this iterable of values that comply with the given `condition`.
 	 */
	indicesWhere(condition, from = 0) {
		return this.filteredMap( 
			(_, i) => i,
			(v, i, iter) => condition(v, i, iter) && i >= from
		);
	}

	/** `isEmpty()` returns if the sequence has no elements.
	 */
	isEmpty() {
		return this.reduce((accum, _value, _i, iter) => {
			iter.return();
			return false;
		}, true);
	}

	/** `length` is the amount of values in the sequence.
	 */
	get length() {
		return this.reduce((accum) => accum + 1, 0);
	}

// Reductions //////////////////////////////////////////////////////////////////

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

	/** `join(sep='')` concatenates all strings in the sequence using `sep` as
	 * separator. If `sep` is not given, '' is assumed.
	 */
	join(sep = '', prefix = '') {
		sep = ''+ sep;
		if (sep) {
			return this.reduce((accum, value, i) => 
				accum + ((i === 0) ? value : sep + value), prefix);
		} else {
			return this.reduce((accum, value) => accum + value, prefix);
		}
	}

	/** `max(n=-Infinity)` returns the maximum of all numbers in the sequence,
	 * or `-Infinity` if the sequence is empty.
	 */
	max(n = -Infinity) {
		n = isNaN(n) ? -Infinity : +n;
		return this.reduce((n1, n2) => Math.max(n1, n2), n);
	}

	/** `maxBy(compareFunction, defaultValue)` returns the maximum of all 
	 * numbers in the sequence, according to the given `compareFunction`, or 
	 * `defaultValue` if the sequence is empty.
	 */
	maxBy(compareFunction, defaultValue = -Infinity) {
		return this.reduce(
			(v1, v2) => compareFunction(v1, v2) < 0 ? v2 : v1,
			defaultValue
		);
	}

	/** `min(n=Infinity)` returns the minimum of all numbers in the sequence,
	 * or `Infinity` if the sequence is empty.
	 */
	min(n = +Infinity) {
		n = isNaN(n) ? +Infinity : +n;
		return this.reduce((n1, n2) => Math.min(n1, n2), n);
	}

	/** `minBy(compareFunction, defaultValue)` returns the maximum of all
	 * numbers in the sequence, according to the given `compareFunction`, or
	 * `defaultValue` if the sequence is empty.
	 */
	minBy(compareFunction, defaultValue = +Infinity) {
		return this.reduce(
			(v1, v2) => compareFunction(v1, v2) > 0 ? v2 : v1,
			defaultValue
		);
	}
	
	/** `reduce(foldFunction, initial)` folds the elements of this iterable 
	 * with `foldFunction` as a left associative operator. The `initial` value 
	 * is used as a starting point, but if it is not defined, then the first 
	 * element in the sequence is used.
	 */
	reduce(foldFunction, initial) {
		return this.scanl(foldFunction, initial).lastValue(initial);
	}

	/** `sum(n=0)` returns the sum of all numbers in the sequence, or `n` if
	 * the sequence is empty.
	 */
	sum(n = 0) {
		n = isNaN(n) ? 0 : +n;
		return this.reduce((n1, n2) => n1 + n2, n);
	}

// Selections //////////////////////////////////////////////////////////////////

	/** `drop(n=1)` returns an iterable with the same elements than this, 
	 * except the first `n` ones.
	 */
	drop(n = 1) {
		n = isNaN(n) ? 1 : Math.floor(n);
		return this.slice(n);
	}

	/** `filter(filterFunction)` returns an iterable of this iterable elements
	 * for which `condition` returns true.
	 */
	filter(condition) {
		return this.filteredMap(null, condition || __toBool__);
	}

	/** `get(index, defaultValue)` returns the value at the given `index`, or
	 * `defaultValue` if there is not one.  
	 */
	get(index, defaultValue) {
		let filtered = this.filter((_value, i, _iter) => {
			return i === index;
		});
		return (arguments.length < 2) ? filtered.head() : 
			filtered.head(defaultValue);
	}

	/** `slice(begin=0, end=Infinity)` return an iterable over a portion of the
	 * this sequence from `begin` to `end`.
	 */
	slice(begin = 0, end = Infinity) {
		begin = isNaN(begin) ? 0 : Math.floor(begin);
		end = isNaN(end) ? Infinity : Math.floor(end);
		return this.filteredMap(null, (_, i, iter) => {
			if (i >= end) {
				iter.return();
				return false;
			} else {
				return i >= begin;
			}
		});
	}

	/** `tail()` returns an iterable with the same elements than this, except 
	 * the first one.
	 */
	tail() {
		return this.drop(1); //FIXME Should raise an error if this is empty.
	}

	/** `take(n=1)` return an iterable with the first `n` elements of this one.
	 */
	take(n = NaN) {
		n = isNaN(n) ? 1 : Math.floor(n);
		return this.slice(0, n);
	}

// Unary operations ////////////////////////////////////////////////////////////

// Variadic operations /////////////////////////////////////////////////////////
	
	/** 
	 */
	static zip(...iterables) {
		return this.zipWith(__id__, ...iterables);
	}

	/** 
	 */
	zip(...iterables) {
		return this.constructor.zip(this, ...iterables);
	}

	/** 
	 */
	zipWith(zipFunction, ...iterables) {
		return this.constructor.zipWith(zipFunction, this, ...iterables);
	}

} // class AbstractIterable
