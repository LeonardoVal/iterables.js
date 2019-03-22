/**
 */
function generatorIterator(nextFunction) {
	var done = false;
	return {
		next: function () {
			if (done) {
				return { done: true };
			} else {
				var obj = {};
				return then(nextFunction(obj), function () {
					done = obj.done;
					return obj;		
				});
			}
		},
		return: function () {
			done = true;
			return { done: true };
		}
	};
}
Iterable.generatorIterator = generatorIterator;
