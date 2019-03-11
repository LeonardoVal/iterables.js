/** `repeat(value, n=Infinity)` builds an iterable that repeats the given `value` `n` times (or
forever by default).
*/
$builderMethod(function repeatIterator(value, n) {
	n = isNaN(n) ? Infinity : +n;
	return generatorWithIndexIterator(function (obj, i) {
		if (i >= n) {
			obj.done = true;
		} else {
			obj.value = value;
		}
	});
});
