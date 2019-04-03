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
		var buffer = [];
		return this.filter(function (value) {
			for (var i = 0; i < buffer.length; i++) {
				if (equality ? equality(value, buffer[i]) : (value === buffer[i])) {
					return false;
				}
			}
			buffer.push(value);
			return true;
		});
	}
};
