define(['list-utils', 'tests-common'], function (list_utils, test_common) { "use strict";
	var expectIterator = test_common.expectIterator,
		expectList = test_common.expectList;

	describe("Lists from arrays:", function () {
		it("`Iterable.arrayIterator` function", function () {
			expect(list_utils.Iterable.fromArrayIterator).toBeOfType('function');
			var arrayIterator = list_utils.Iterable.fromArrayIterator.bind(list_utils.Iterable);
			expectIterator(arrayIterator([]), []);
			expectIterator(arrayIterator([true]), [true]);
			expectIterator(arrayIterator([1, 2]), [1, 2]);
			expectIterator(arrayIterator(['a', 'b', 'c']), ['a', 'b', 'c']);
		});

		it("`ArrayIterable` class", function () {
			expect(list_utils.FromArrayIterable).toBeOfType('function');
			expectList(new list_utils.FromArrayIterable([]), []);
			expectList(new list_utils.FromArrayIterable([true]), [true]);
			expectList(new list_utils.FromArrayIterable([1, 2]), [1, 2]);
			expectList(new list_utils.FromArrayIterable(['a', 'b', 'c']), ['a', 'b', 'c']);
		});

		it("`Iterable.fromArray` function", function () {
			expect(list_utils.Iterable.fromArray).toBeOfType('function');
			var fromArray = list_utils.Iterable.fromArray.bind(list_utils.Iterable);
			expectList(fromArray([]), []);
			expectList(fromArray([true]), [true]);
			expectList(fromArray([1, 2]), [1, 2]);
			expectList(fromArray(['a', 'b', 'c']), ['a', 'b', 'c']);
		});

		it("`Iterable.fromValues` function", function () {
			expect(list_utils.Iterable.fromValues).toBeOfType('function');
			var fromValues = list_utils.Iterable.fromValues.bind(list_utils.Iterable);
			expectList(fromValues(), []);
			expectList(fromValues(true), [true]);
			expectList(fromValues(1, 2), [1, 2]);
			expectList(fromValues('a', 'b', 'c'), ['a', 'b', 'c']);
		});

		it("`Iterable.toArray` function", function () {
			expect(list_utils.Iterable.prototype.toArray).toBeOfType('function');
			var fromValues = list_utils.Iterable.fromValues.bind(list_utils.Iterable);
			expect(fromValues().toArray()).toEqual([]);
			expect(fromValues(true).toArray()).toEqual([true]);
			expect(fromValues(1, 2).toArray()).toEqual([1, 2]);
			expect(fromValues('a', 'b', 'c').toArray()).toEqual(['a', 'b', 'c']);
		});
	}); // describe "Lists from arrays:"
}); //// define
