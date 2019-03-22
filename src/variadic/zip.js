/** 
 */
Iterable.zip = function zip() {
	return this.zipWith(Array.prototype.slice.call(arguments));
};

Iterable.prototype.zip = Iterable.zip;
