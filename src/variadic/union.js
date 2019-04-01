/** The `union(lists)` methods treat this and each iterable argument as sets, and calculate the
 * union of all. 
 * 
 * Warning! All the elements of the result are stored in memory.
 */
Iterable.union = function union(lists, equality) {
	return Iterable.concat(lists).nub(equality);
};
