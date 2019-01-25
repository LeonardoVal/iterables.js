define(['list-utils'], function (list_utils) { "use strict";
	describe("Singletons lists:", function () {
		it("`Iterable.singletonIterator` function", function () {
			expect(list_utils.Iterable.singletonIterator).toBeOfType('function');
			var it = list_utils.Iterable.singletonIterator(Math.PI);
			expect(it.next).toBeOfType('function');
			expect(it.return).toBeOfType('function');
			var x = it.next();
			expect(x.done).toBeFalsy();
			expect(x.value).toBe(Math.PI);
			x = it.next();
			expect(x.done).toBeTruthy();
			expect(x.value).not.toBeDefined();
		});

		it("`Iterable.singleton` function", function () {
			expect(list_utils.Iterable.singleton).toBeOfType('function');
			expect(list_utils.Iterable.singleton()).toBeOfType(list_utils.Iterable);
		});
	}); // describe "Singletons lists:"
}); //// define
