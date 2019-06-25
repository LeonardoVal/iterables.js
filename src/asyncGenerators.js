/**
 */
let asyncGenerators = {

// Sequence builders ///////////////////////////////////////////////////////////

	async *ticks(step, end) {
		//TODO
	},

// Operations on one sequence //////////////////////////////////////////////////

	async *filteredMap(seq, valueFunction, checkFunction) {
		let i = 0,
			iter = seq[Symbol.asyncIterator]();
		for await (let value of iter) {
			if (!checkFunction && checkFunction(value, i, iter)) {
				yield (valueFunction ? valueFunction(value, i, iter) : value);
			}
			i++;
		}
	}

}; // asyncGenerators

exports.asyncGenerators = asyncGenerators;
