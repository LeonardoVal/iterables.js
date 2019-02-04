define(['list-utils'], function (list_utils) { "use strict";
	function expectList(list, expectedList) {
		expect(list.__iter__).toBeOfType('function');
		expect(list.length()).toBe(expectedList.length);
		expectedList.forEach(function (expectedValue, index) {
			expect(list.get(index)).toBe(expectedValue);
		});
		expect(list.get.bind(list, expectedList.length + 1)).toThrow();
		expect(list.get.bind(list, -1)).toThrow();
		expect(list.get(expectList.length + 1, null)).toBe(null);
		expect(list.get(-1, '-1')).toBe('-1');
		expectIterator(list.__iter__(), expectedList);
	}

	function expectIterator(iterator, expectedList) {
		expect(iterator.next).toBeOfType('function');
		expect(iterator.return).toBeOfType('function');
		var x;
		for (var i = 0; i < expectedList.length; i++) {
			x = iterator.next();
			expect(x.done).toBeFalsy();
			expect(x.value).toBe(expectedList[i]);
		}
		x = iterator.next();
		expect(x.done).toBeTruthy();
		expect(x.value).not.toBeDefined();
	}

	describe("Lists from arrays:", function () {
		it("`Iterable.iteratorFromArray` function", function () {
			expect(list_utils.Iterable.iteratorFromArray).toBeOfType('function');
			var iteratorFromArray = list_utils.Iterable.iteratorFromArray.bind(list_utils.Iterable);
			expectIterator(iteratorFromArray([]), []);
			expectIterator(iteratorFromArray([true]), [true]);
			expectIterator(iteratorFromArray([1, 2]), [1, 2]);
			expectIterator(iteratorFromArray(['a', 'b', 'c']), ['a', 'b', 'c']);
		});

		it("`ArrayIterable` class", function () {
			expect(list_utils.ArrayIterable).toBeOfType('function');
			expectList(new list_utils.ArrayIterable([]), []);
			expectList(new list_utils.ArrayIterable([true]), [true]);
			expectList(new list_utils.ArrayIterable([1, 2]), [1, 2]);
			expectList(new list_utils.ArrayIterable(['a', 'b', 'c']), ['a', 'b', 'c']);
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
