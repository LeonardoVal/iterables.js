/** `enumFromThenTo(from=0, then=from+1, to=Infinity)` builds an Iterable object that goes over 
enumeration defined by the given values: `from` being the first one and `then` being the second one.
For example, `enumFromThenTo(1,3,8)` represents the sequence `[1,3,5,7]`.

The big difference with `range` is that the enumeration can go in either direction. For example,
`enumFromThenTo(10,7,0)` represents the sequence `[10,7,4,1]`.
*/
$builderMethod(function enumFromThenToIterator(from, then, to) {
	if (typeof from === 'undefined') {
		from = 0;
	}
	if (typeof then === 'undefined') {
		then = from + 1;
	}
	if (typeof to === 'undefined') {
		to = then > from ? +Infinity : -Infinity;
	}
	var step = then - from;
	return generatorIterator(function (obj) {
		if (step > 0 ? from > to : from < to) {
			obj.done = true;
		} else {
			obj.value = from;
			from += step;
		}
	});
});

Iterable.enumFromThen = function enumFromThen(from, then) {
	return Iterable.enumFromThenTo(from, then, then > from ? +Infinity : -Infinity);
};

Iterable.enumFrom = function enumFrom(from) {
	return Iterable.enumFromThenTo(from, from + 1, +Infinity);
};
