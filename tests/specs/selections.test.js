define(['list-utils', 'tests-common'], function (list_utils, test_common) { "use strict";
	var expectIterator = test_common.expectIterator,
		expectList = test_common.expectList;

	describe("Lists selections:", function () {
		it("`Iterable.filterIterator` function", function () {
			expect(list_utils.Iterable.filterIterator).toBeOfType('function');
			var filterIterator = list_utils.Iterable.filterIterator.bind(list_utils.Iterable),
				fromArray = list_utils.Iterable.fromArray.bind(list_utils.Iterable);
			expectIterator(filterIterator(fromArray([false, true, false])), [true]);
			expectIterator(filterIterator(fromArray([0, 1, 2])), [1, 2]);
			expectIterator(filterIterator(fromArray(['', 'a', 'aa', 'aaa'])), ['a', 'aa', 'aaa']);
			expectIterator(filterIterator(fromArray(['', 0, null, false])), []);
			expectIterator(filterIterator(fromArray([0, 1, 2, 3, 4]), function (n) {
					return n % 2;
				}), [1, 3]);
			expectIterator(filterIterator(fromArray([0, 1, 2, 3, 4]), function (n) {
					return n > 2;
				}), [3, 4]);
			expectIterator(filterIterator(fromArray(['', 'a', 'aa', 'aaa']), function (x) {
					return x.length % 2;
				}), ['a', 'aaa']);
		});

		it("`Iterable.filter` function", function () {
			expect(list_utils.Iterable.prototype.filter).toBeOfType('function');
			var fromArray = list_utils.Iterable.fromArray.bind(list_utils.Iterable);
			expectList(fromArray([false, true, false]).filter(), [true]);
			expectList(fromArray([0, 1, 2]).filter(), [1, 2]);
			expectList(fromArray(['', 'a', 'aa', 'aaa']).filter(), ['a', 'aa', 'aaa']);
			expectList(fromArray(['', 0, null, false]).filter(), []);
			expectList(fromArray([0, 1, 2, 3, 4]).filter(function (n) {
					return n % 2;
				}), [1, 3]);
			expectList(fromArray([0, 1, 2, 3, 4]).filter(function (n) {
					return n > 2;
				}), [3, 4]);
			expectList(fromArray(['', 'a', 'aa', 'aaa']).filter(function (x) {
					return x.length % 2;
				}), ['a', 'aaa']);
		});

		it("`Iterable.takeWhile` function", function () {
			expect(list_utils.Iterable.prototype.takeWhile).toBeOfType('function');
			var fromArray = list_utils.Iterable.fromArray.bind(list_utils.Iterable);
			expectList(fromArray([0,1,0,1,0,1]).takeWhile(), []);
			expectList(fromArray([1,1,0,1,0,1]).takeWhile(), [1, 1]);
			expectList(fromArray([0,1,0,1,0,1]).takeWhile(function (n) {
					return !n;
				}), [0]);
			expectList(fromArray([0,0,0,1,0,1]).takeWhile(function (n) {
					return !n;
				}), [0, 0, 0]);
		});

		it("`Iterable.take` function", function () {
			expect(list_utils.Iterable.prototype.take).toBeOfType('function');
			var fromArray = list_utils.Iterable.fromArray.bind(list_utils.Iterable),
				array = [0,1,2,3,4,5];
			for (var i = 0; i <= array.length; i++) {
				expectList(fromArray(array).take(i), array.slice(0,i));
			}
		});

		it("`Iterable.head` function", function () {
			expect(list_utils.Iterable.prototype.head).toBeOfType('function');
			var fromArray = list_utils.Iterable.fromArray.bind(list_utils.Iterable);
			expect(fromArray([false, true, false]).head()).toBe(false);
			expect(fromArray([0, 1, 2]).head()).toBe(0);
			expect(fromArray([77, 7]).head()).toBe(77);
			expect(fromArray(['a']).head()).toBe('a');
			expect(list_utils.Iterable.prototype.head.bind(fromArray([]))).toThrow();
			expect(fromArray([]).head(null)).toBe(null);
		});

		it("`Iterable.dropWhile` function", function () {
			expect(list_utils.Iterable.prototype.dropWhile).toBeOfType('function');
			var fromArray = list_utils.Iterable.fromArray.bind(list_utils.Iterable);
			expectList(fromArray([0,1,0]).dropWhile(), [0,1,0]);
			expectList(fromArray([1,1,0,1,0,1]).dropWhile(), [0,1,0,1]);
			expectList(fromArray([0,1,0]).dropWhile(function (n) {
					return !n;
				}), [1,0]);
			expectList(fromArray([0,0,0,1,0,1]).dropWhile(function (n) {
					return !n;
				}), [1,0,1]);
		});

		it("`Iterable.drop` function", function () {
			expect(list_utils.Iterable.prototype.drop).toBeOfType('function');
			var fromArray = list_utils.Iterable.fromArray.bind(list_utils.Iterable),
				array = [0,1,2,3,4,5];
			for (var i = 0; i <= array.length; i++) {
				expectList(fromArray(array).drop(i), array.slice(i));
			}
		});
	}); // describe "Lists from arrays:"
}); //// define
