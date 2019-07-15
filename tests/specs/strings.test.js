define(['list-utils', 'tests-common'], function (listUtils, test_common) { "use strict";
	var expectList = test_common.expectList;

	describe("Lists from strings:", function () {
		it("`StringIterable` class", function () {
			let StringIterable = listUtils.StringIterable;
			expect(StringIterable).toBeOfType('function');
			expectList(new StringIterable(""), []);
			expectList(new StringIterable("a"), ["a"]);
			expectList(new StringIterable("ab"), ["a", "b"]);
			expectList(new StringIterable("abc"), ["a", "b", "c"]);
		});

		it("`Iterable.fromString` function", function () {
			let Iterable = listUtils.Iterable,
				fromString = Iterable.fromString.bind(Iterable);
			expect(Iterable.fromString).toBeOfType('function');
			expectList(fromString(""), []);
			expectList(fromString("a"), ["a"]);
			expectList(fromString("ab"), ["a", "b"]);
			expectList(fromString("abc"), ["a", "b", "c"]);
		});

		it("`Iterable.join` function", function () {
			let Iterable = listUtils.Iterable,
				fromString = Iterable.fromString.bind(Iterable);
			expect(Iterable.prototype.join).toBeOfType('function');
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
