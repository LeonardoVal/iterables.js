define(['list-utils'], function (list_utils) { "use strict";
	describe("Empty lists:", function () {
		it("`Iterable.emptyIterator` function", function () {
			expect(list_utils.Iterable.emptyIterator).toBeOfType('function');
			var it = list_utils.Iterable.emptyIterator();
			expect(it.next).toBeOfType('function');
			var x = it.next();
			expect(x.done).toBeTruthy();
			expect(x.value).not.toBeDefined();
		});

		it("`EmptyIterable` class", function () {
			expect(list_utils.EmptyIterable).toBeOfType('function');
			expect(list_utils.EmptyIterable.prototype).toBeOfType(list_utils.Iterable);
		});

		it("`Iterable.empty` function", function () {
			expect(list_utils.Iterable.empty).toBeOfType('function');
			expect(list_utils.Iterable.empty()).toBeOfType(list_utils.EmptyIterable);
		});

		it("`Iterable.EMPTY` singleton", function () {
			expect(list_utils.Iterable.EMPTY).toBeOfType(list_utils.EmptyIterable);
		});
	}); // describe "Empty lists:"
}); //// define
