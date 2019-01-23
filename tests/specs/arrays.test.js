define(['list-utils'], function (list_utils) { "use strict";
	function expectList(list) {
		expect(list.__iter__).toBeOfType('function');
		expectIterator(list.__iter__());
	}

	function expectIterator(iterator) {
		expect(iterator.next).toBeOfType('function');
		var x;
		for (var i = 1; i < arguments.length; i++) {
			x = iterator.next();
			expect(x.done).toBeFalsy();
			expect(x.value).toEqual(arguments[i]);
		}
		x = iterator.next();
		expect(x.done).toBeTruthy();
		expect(x.value).not.toBeDefined();
	}	

	describe("Lists from arrays:", function () {
		it("`Iterable.iteratorFromArray` function", function () {
			var iteratorFromArray = list_utils.Iterable.iteratorFromArray;
			expect(iteratorFromArray).toBeOfType('function');
			expectIterator(iteratorFromArray([]));
			expectIterator(iteratorFromArray([true]), true);
			expectIterator(iteratorFromArray([1, 2]), 1, 2);
			expectIterator(iteratorFromArray(['a', 'b', 'c']), 'a', 'b', 'c');
		});

		//TODO More tests.
	}); // describe "Lists from arrays:"
}); //// define
