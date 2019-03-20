/** `slice(begin=0, end=Infinity)` return an iterable over a portion of the given `list` from 
 * `begin` to `end`.
 */
function sliceIterator(list, begin, end) {
	begin = isNaN(begin) ? 0 : Math.floor(begin);
	end = isNaN(end) ? Infinity : Math.floor(end);
	return filteredMapIterator(list, null, function (_, i, iter) {
		if (i < begin) {
			return false;
		} else if (i >= end) {
			iter.return();
			return false;
		} else {
			return true;
		}
	});
}
$methodOn1List(sliceIterator);
