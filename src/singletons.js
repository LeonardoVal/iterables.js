/**
*/

/**
*/
Iterable.singletonIterator = function singletonIterator(value) {
	var i = 0;
	return { 
		next: function next_singletonIterator() {
			return (i++ < 1) ? { value: value } : { done: true };
		},
		return: function return_singletonIterator() {
			i = 1;
			return { done: true };
		}
	};
};

/** 
*/
Iterable.singleton = function singleton(value) {
	return new Iterable(Iterable.singletonIterator, value);
};