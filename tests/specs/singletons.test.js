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

	describe("Singletons lists:", function () {
		it("`Iterable.singletonIterator` function", function () {
			expect(list_utils.Iterable.singletonIterator).toBeOfType('function');
			expectIterator(list_utils.Iterable.singletonIterator(Math.PI), [Math.PI]);
			expectIterator(list_utils.Iterable.singletonIterator(), [undefined]);
		});

		it("`Iterable.singleton` function", function () {
			expect(list_utils.Iterable.singleton).toBeOfType('function');
			expect(list_utils.Iterable.singleton()).toBeOfType(list_utils.Iterable);
			expectList(list_utils.Iterable.singleton(Math.PI), [Math.PI]);
			expectList(list_utils.Iterable.singleton(), [undefined]);
		});
	}); // describe "Singletons lists:"
}); //// define
