/**
 */
function generatorWithIndexIterator(nextFunction) {
	var i = -1;
	return generatorIterator(function (obj) {
		i++;
		return nextFunction(obj, i);
	});
}
Iterable.generatorWithIndexIterator = generatorWithIndexIterator;
