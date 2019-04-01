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
		var buffer = this.toArray();
		return this.filter(function (value, i) {
			for (var j = i - 1; j >= 0; j--) {
				if (equality ? equality(value, buffer[j]) : value === buffer[j]) {
					return false;
				}
			}
			return true;
		});
	}
};
