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

// Conversions /////////////////////////////////////////////////////////////////

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

	/** `reduce(foldFunction, initial)` folds the elements of this iterable 
	 * with `foldFunction` as a left associative operator. The `initial` value 
	 * is used as a starting point, but if it is not defined, then the first 
	 * element in the sequence is used.
	 */
	reduce(foldFunction, initial) {
		return this.scanl(foldFunction, initial).lastValue(initial);
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

// Unary operations ////////////////////////////////////////////////////////////

// Variadic operations /////////////////////////////////////////////////////////
	
} // class AbstractIterable
