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
		let source = this.generator ? this.generator(this.source)
				: this.source,
			iterator = typeof source === 'function' ? source 
				: source[Symbol.iterator]();
		return AsyncIterable.__aiter__(iterator);
	}


	
	/**
	 */
	async forEach(doFunction, ifFunction) {
		let result;
		for (result in this.filteredMap(doFunction, ifFunction)) {
			// Do nothing
		}
		return result;
	}

// Builders ////////////////////////////////////////////////////////////////////

	ticks(step, end) {
		return generatorIterator(function (obj) {
			if (Date.now() >= end) {
				obj.done = true;
				return Promise.resolve(obj);
			} else {
				return new Promise(function executor(resolve, reject) { 
					setTimeout(function () {
						obj.value = Date.now();
						resolve(obj);
					}, step);
				});
			}
		});
	}

// Conversions /////////////////////////////////////////////////////////////////



// Properties //////////////////////////////////////////////////////////////////



// Reductions //////////////////////////////////////////////////////////////////


// Selections //////////////////////////////////////////////////////////////////


// Unary operations ////////////////////////////////////////////////////////////


// Variadic operations /////////////////////////////////////////////////////////
	
} // class Iterable

exports.Iterable = Iterable;
