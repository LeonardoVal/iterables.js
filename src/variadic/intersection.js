/** The `intersection(lists, equality)` methods treats the given `lists` as sets, and calculates the 
 * intersection of all of them. The `equality` function is used to compare values. If it is not 
 * given, the standard equality operator (`===`) is used.
 */
Iterable.intersection = function intersection(lists, equality) {
	var firstList = lists[0],
		otherLists = lists.slice(1);
	return firstList.filter(function (value) {
		var eq;
		for (var i = 0; i < otherLists.length; i++) {
			eq = !equality ? otherLists[i].has(value) :
				otherLists[i].indexWhere(equality.bind(null, value)) >= 0;
			if (!eq) {
				return false;
			}
		}
		return true;
	});
};
