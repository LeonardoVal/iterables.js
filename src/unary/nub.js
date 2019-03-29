/** The `nub` of a sequence is another sequence with each element only appearing once. Basically 
 * repeated elements are removed. The argument `equality` may have a function to compare the 
 * sequence's values.
 * 
 * Warning! All the elements of the result are stored in memory.
 */
Iterable.prototype.nub = function nub(equality) {
	if (SET_TYPE_IS_DEFINED && !equality) {
		return Iterable.fromSet(new Set(this));
	} else {
		var buffered = this.buffered();
		return this.filter(function (value) {
			return equality ? buffered.has(value) : 
				!buffered.filter(equality.bind(null, value)).isEmpty();
		});
	}
};
