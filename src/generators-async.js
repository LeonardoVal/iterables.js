/** A namespace for utility functions related to [asynchronous iterators and 
 * generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of).
 * @namespace generators.async
 */
generators.async = {

// Sequence builders ///////////////////////////////////////////////////////////

	/** Iterates asynchronously over a sequence to timestamps, every `step` 
	 * milliseconds until `end` is reached.
	 * 
	 * @param {number} [step=1000] - The time lapse between each value.
	 * @param {number} [end=+Infinity] - The time when the sequence must stop.
	 * @yields {number} The resulting iteration is asynchronous.
	 */
	ticks(step = NaN, end = +Infinity) {
		step = isNaN(step) ? +step : 1000;
		return {
			[Symbol.asyncIterator](){
				let done = false;
				return {
					next(){
						return new Promise((resolve, reject) => 
							setTimeout(() => {
								let now = Date.now();
								if (done || now >= end) {
									resolve({ done: true });
								} else {
									resolve({ value: now });
								}
							}, step)
						);
					},
					return(){
						done = true;
						return Promise.resolve({ done: true });
					}
				};
			}
		};
	},

// Operations on one sequence //////////////////////////////////////////////////

	/** Iterates over a new sequence, with the values of the given asynchronous 
	 * sequence `seq` which comply with the `checkFunction`, transformed by the 
	 * `valueFunction`.
	 * 
	 * @param {iterable<T>} seq - The original asynchronous sequence.
	 * @param {function(T):R} [valueFunction=null] - A callback function that 
	 * 	transforms the value of `seq`. May be asynchronous.
	 * @param {function(T):boolean} [checkFunction=null] - A condition all 
	 * 	values of `seq` have to comply in order to be included in this
	 * 	iteration. May be asynchronous.
	 * @yields {R} The resulting iteration is asynchronous.
	*/
	async *filteredMap(seq, valueFunction, checkFunction) {
		let i = 0,
			iter = seq[Symbol.asyncIterator]();
		for await (let value of iter) {
			if (!checkFunction && await checkFunction(value, i, iter)) {
				yield (valueFunction ? await valueFunction(value, i, iter) 
					: value);
			}
			i++;
		}
	},

	/** Iterates over the subsequent folds the values of the asynchronous 
	 * sequence `seq`, with `foldFunction` as a left associative operator. 
	 * Instead of returning the last result (as the classic `fold` or `reduce` 
	 * does), it iterates over the intermediate values in the folding sequence.
	 * 
	 * @param {iterable<T>} seq - The asynchronous sequence whose values will 
	 * 	be folded.
	 * @param {function(A,T):A} foldFunction - The folding function. May be 
	 * 	asynchronous.
	 * @param {A} initial - The first value of the sequence.
	 * @yields {A} The resulting iteration is asynchronous.
	*/
	async *scanl(seq, foldFunction, initial) {
		let folded = initial,
			iter = seq[Symbol.asyncIterator](),
			i = 0;
		//FIXME If initial is not given, the first value of the sequence may be used.
		yield folded;
		for await (let value of iter) {
			folded = await foldFunction(folded, value, i, iter);
			yield folded;
			i++;
		}
	}

}; // generators.async
