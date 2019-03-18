/** `tail()` returns an iterable with the same elements than this, except the first one.
*/
Iterable.prototype.tail = function tail() {
	return this.drop(1); //FIXME Should raise an error if this is empty.
};
