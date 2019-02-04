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

	describe("Lists from strings:", function () {
		it("`Iterable.iteratorFromString` function", function () {
			expect(list_utils.Iterable.iteratorFromString).toBeOfType('function');
			var iteratorFromString = list_utils.Iterable.iteratorFromString.bind(list_utils.Iterable);
			expectIterator(iteratorFromString(""), []);
			expectIterator(iteratorFromString("a"), ["a"]);
			expectIterator(iteratorFromString("ab"), ["a", "b"]);
			expectIterator(iteratorFromString("abc"), ["a", "b", "c"]);
		});

		it("`StringIterable` class", function () {
			expect(list_utils.StringIterable).toBeOfType('function');
			expectList(new list_utils.StringIterable(""), []);
			expectList(new list_utils.StringIterable("a"), ["a"]);
			expectList(new list_utils.StringIterable("ab"), ["a", "b"]);
			expectList(new list_utils.StringIterable("abc"), ["a", "b", "c"]);
		});

		it("`Iterable.fromString` function", function () {
			expect(list_utils.Iterable.fromString).toBeOfType('function');
			var fromString = list_utils.Iterable.fromString.bind(list_utils.Iterable);
			expectList(fromString(""), []);
			expectList(fromString("a"), ["a"]);
			expectList(fromString("ab"), ["a", "b"]);
			expectList(fromString("abc"), ["a", "b", "c"]);
		});

		it("`Iterable.join` function", function () {
			expect(list_utils.Iterable.prototype.join).toBeOfType('function');
			var fromString = list_utils.Iterable.fromString.bind(list_utils.Iterable);
			expect(fromString("").join()).toBe("");
			expect(fromString("").join(',')).toBe("");
			expect(fromString("a").join()).toBe("a");
			expect(fromString("a").join(',')).toBe("a");
			expect(fromString("ab").join()).toBe("ab");
			expect(fromString("ab").join(',')).toBe("a,b");
			expect(fromString("abc").join()).toBe("abc");
			expect(fromString("abc").join('|')).toBe("a|b|c");
		});
	}); // describe "Lists from arrays:"
}); //// define
