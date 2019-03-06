/**
*/

/**
*/
Iterable.singletonIterator = function singletonIterator(value) {
	return generatorWithIndexIterator(function (obj, i) {
		if (i > 0) {
			obj.done = true;
		} else {
			obj.value = value; 
		}
	});
};

/** 
*/
Iterable.singleton = function singleton(value) {
	return new Iterable(Iterable.singletonIterator, value);
};