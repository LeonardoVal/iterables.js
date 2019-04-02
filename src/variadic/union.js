/** The `union(lists, equality)` methods treats the given `lists` as sets, and calculates the union
 * of all of them. The `equality` function is used to compare values to avoid repeating them. If it
 * is not given, the standard equality operator (`===`) is used. 
 * 
 * Warning! All the elements of the result are stored in memory.
 */
Iterable.union = function union(lists, equality) {
	return Iterable.concat(lists).nub(equality);
};
