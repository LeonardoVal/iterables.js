/**
*/

/**
*/
Iterable.singletonIterator = function singletonIterator(value) {
	var i = 0,
		done = false;
	return { 
		next: function next_singletonIterator() {
			done = done && (i++) > 1;
			return done ? { done: true } : { value: value };
		},
		return: function return_singletonIterator() {
			done = true;
			return { done: true };
		}
	};
};

/** 
*/
Iterable.singleton = function singleton(value) {
	return new Iterable(Iterable.singletonIterator, value);
};