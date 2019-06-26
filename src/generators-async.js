/**
 */
generators.async = {

// Sequence builders ///////////////////////////////////////////////////////////

	/** `ticks(step=1000, end=+Infinity)` generates an asynchronous sequence
	 * that resolves to timestamps every `step` milliseconds until `end` is
	 * reached.
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

	async *scanl(seq, foldFunction, initial) {
		let folded = initial,
			iter = seq[Symbol.asyncIterator](),
			i = 0;
		yield folded;
		for await (let value of iter) {
			folded = await foldFunction(folded, value, i, iter);
			yield folded;
			i++;
		}
	}

}; // generators.async
