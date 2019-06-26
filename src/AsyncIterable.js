/**
 */
class AsyncIterable {
	/**
	 */
	constructor (source, generator = null) {
		if (typeof source === 'function' && arguments.length > 1) {
			source = source.bind(Array.prototype.slice.call(arguments, 1));
		}
		Object.defineProperty(this, 'source', { value: source });
	}

	/**
	 */
	get isAsync() {
		return true;
	}

	/** 
	 */
	static __aiter__(iterator) {
		if (iterator.return) {
			return iterator;
		} else {
			let done = false;
			return {
				next() {
					return done ? Promise.resolve({ done: true }) 
						: iterator.next();
				},
				return() { 
					done = true; 
					return Promise.resolve({ done: true });
				}
			};
		}
	}

	/** 
	 */
	[Symbol.asyncIterator](){
		let iterator = typeof source === 'function' ? source() 
				: source[Symbol.asyncIterator]();
		return AsyncIterable.__aiter__(iterator);
	}
	
	/**
	 */
	filteredMap(valueFunction, checkFunction) {
		return new AsyncIterable(generators.filteredMap, this, valueFunction,
			checkFunction);
	}

	/**
	 */
	async forEach(doFunction, ifFunction) {
		let result;
		for await (result of this.filteredMap(doFunction, ifFunction)) {
			// Do nothing
		}
		return result;
	}

// Builders ////////////////////////////////////////////////////////////////////

	ticks(step, end) {
		return new AsyncIterator(generators.async.ticks, step, end);
	}

// Conversions /////////////////////////////////////////////////////////////////



// Properties //////////////////////////////////////////////////////////////////



// Reductions //////////////////////////////////////////////////////////////////

	/** `scanl(seq, foldFunction, initial)` folds the elements of this iterable 
	 * with `foldFunction` as a left associative operator. Instead of returning 
	 * the last result, it iterates over the intermediate values in the folding 
	 * sequence.
	 */
	scanl(foldFunction, initial) {
		return new AsyncIterable(generators.async.scanl, this, foldFunction, 
			initial);
	}

// Selections //////////////////////////////////////////////////////////////////


// Unary operations ////////////////////////////////////////////////////////////


// Variadic operations /////////////////////////////////////////////////////////
	
} // class Iterable

exports.AsyncIterable = AsyncIterable;
