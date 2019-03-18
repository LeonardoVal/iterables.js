/**
 */
var SingletonIterable = $subtype(function singletonIterator(value) {
	return generatorWithIndexIterator(function (obj, i) {
		if (i > 0) {
			obj.done = true;
		} else {
			obj.value = value; 
		}
	});
});