define(['list-utils'], function (list_utils) { "use strict";
	function expectList(list) {
		expect(list.__iter__).toBeOfType('function');
		expectIterator.apply(null, 
			[list.__iter__()].concat(Array.prototype.slice.call(arguments, 1))
		);
	}

	function expectIterator(iterator) {
		expect(iterator.next).toBeOfType('function');
		expect(iterator.return).toBeOfType('function');
		var x;
		for (var i = 1; i < arguments.length; i++) {
			x = iterator.next();
			expect(x.done).toBeFalsy();
			expect(x.value).toBe(arguments[i]);
		}
		x = iterator.next();
		expect(x.done).toBeTruthy();
		expect(x.value).not.toBeDefined();
	}	

	describe("Lists selections:", function () {
		it("`Iterable.filterIterator` function", function () {
			expect(list_utils.Iterable.filterIterator).toBeOfType('function');
			var filterIterator = list_utils.Iterable.filterIterator.bind(list_utils.Iterable),
				fromArray = list_utils.Iterable.fromArray.bind(list_utils.Iterable);
			expectIterator(filterIterator(fromArray([false, true, false])), true);
			expectIterator(filterIterator(fromArray([0, 1, 2])), 1, 2);
			expectIterator(filterIterator(fromArray(['', 'a', 'aa', 'aaa'])), 'a', 'aa', 'aaa');
			expectIterator(filterIterator(fromArray(['', 0, null, false])));
		});
	}); // describe "Lists from arrays:"
}); //// define
