/** `sample(n=1, randomFunction=Math.random)`.
 */
Iterable.prototype.sample = function sample(n, randomFunction) {
	n = +n >= 1 ? Math.floor(n) : 1; 
	randomFunction = randomFunction || Math.random;
	var array = [],
		randoms = [];
	return lastFromIterator(filteredMapIterator(this, function (value) {
		var r = randomFunction();
		array.push(value);
		randoms.push(r);
		for (var i = array.length-1; i > 0; i--) {
			if (randoms[i-1] > randoms[i]) {
				r = randoms[i-1];
				value = array[i-1];
				randoms[i-1] = randoms[i];
				array[i-1] = array[i];
				randoms[i] = r;
				array[i] = value;
			} else {
				break;
			}
		}
		while (array.length > n) {
			array.pop();
			randoms.pop();
		}
		return array;
	}), array);
};