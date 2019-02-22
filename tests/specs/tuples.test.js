define(['list-utils', 'tests-common'], function (list_utils, test_common) { "use strict";
	var expectIterator = test_common.expectIterator,
		expectList = test_common.expectList;

	describe("Lists of tuples:", function () {
		it("zip()", function () {
			var Iterable = list_utils.Iterable;
			expect(Iterable.prototype.zip).toBeOfType('function');
			expect(Iterable.zip).toBeOfType('function');
			var fromString = Iterable.fromString.bind(Iterable);
			[{ 
				lists: [fromString('abc'), fromString('xyz')], 
				expectedResult: [['a','x'], ['b','y'], ['c','z']]
			 }, {
				lists: [fromString('abc'), fromString('x')], 
				expectedResult: [['a','x']]
			 }, {
				lists: [fromString('a'), fromString('xyz')], 
				expectedResult: [['a','x']]
			 }, {
				lists: [fromString(''), fromString('xyz')], 
				expectedResult: []
			 }, {
				lists: [fromString('abc'), fromString('')], 
				expectedResult: []
			 }].forEach(function (test) {
				var lists = test.lists;
				expectList(Iterable.prototype.zip.apply(lists[0], lists.slice(1)), test.expectedResult);
				expectList(Iterable.zip.apply(Iterable, lists), test.expectedResult); 
			});
		});

		it("zipWith()", function () {
			var Iterable = list_utils.Iterable;
			expect(Iterable.prototype.zipWith).toBeOfType('function');
			expect(Iterable.zipWith).toBeOfType('function');
			var fromString = Iterable.fromString.bind(Iterable),
				fromValues = Iterable.fromValues.bind(Iterable);
			[{	
				func: function (vs) { return vs[0] + vs[1]; },
				lists: [fromString('abc'), fromString('xyz')], 
				expectedResult: ['ax', 'by', 'cz']
			 }, {
				func: function (vs) { return (+vs[0]) + (+vs[1]); },
				lists: [fromString('123'), fromString('77')], 
				expectedResult: [8, 9]
			 }, {
				func: function (vs) { return (+vs[0]) + (+vs[1]); },
				lists: [fromString('123'), fromString('')], 
				expectedResult: []
			 }, {
				func: function (vs) { return [vs[2], vs[0], vs[1]]; },
				lists: [fromValues(1,2,3), fromString('abc'), fromValues(true,false,null)],
				expectedResult: [[true,1,'a'], [false,2,'b'], [null,3,'c']]
			 }].forEach(function (test) {
				var func = test.func,
					lists = test.lists;
				expectList(Iterable.prototype.zipWith.apply(lists[0], [func].concat(lists.slice(1))),
					test.expectedResult);
				expectList(Iterable.zipWith.apply(Iterable, [func].concat(lists)), 
					test.expectedResult); 
			});
		});

		it("product()", function () {
			var Iterable = list_utils.Iterable;
			expect(Iterable.prototype.product).toBeOfType('function');
			expect(Iterable.product).toBeOfType('function');
			[{	lists: ['ab', 'xy'],
				expectedResult: [['a','x'],['a','y'],['b','x'],['b','y']]
			 }, { lists: ['ab', 'x'],
			 	expectedResult: [['a','x'],['b','x']]
			 }, { lists: ['a', 'xy'],
				expectedResult: [['a','x'],['a','y']]
			 }, { lists: ['ab', ''],
				expectedResult: []
			 }, { lists: ['', 'xy'],
				expectedResult: []
			 }].forEach(function (test) {
				var lists = test.lists;
				expectList(Iterable.prototype.product.apply(lists[0], lists.slice(1)), test.expectedResult);
				expectList(Iterable.product.apply(Iterable, lists), test.expectedResult);
			});
		});
	}); // describe "Empty lists:"
}); //// define
