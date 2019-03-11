/** `iterate(f, x, n=Infinity)` returns an iterable that repeatedly applies the function `f` to
the value `x`, `n` times (or indefinitely by default).
*/
$builderMethod(function iterateIterator(f, x, n) {
	n = isNaN(n) ? Infinity : +n;
	return generatorWithIndexIterator(function (obj, i) {
		if (i >= n) {
			obj.done = true;
		} else {
			obj.value = x;
			x = f(x);
		}
	});
});
