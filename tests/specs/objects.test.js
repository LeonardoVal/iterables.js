define(['list-utils', 'tests-common'], function (list_utils, test_common) { "use strict";
	var expectIterator = test_common.expectIterator,
		expectList = test_common.expectList;

	describe("Lists from objects:", function () {
		xit("`Iterable.fromObject` function", function () {
			expect(list_utils.Iterable.fromObject).toBeOfType('function');
			var fromObject = list_utils.Iterable.fromObject.bind(list_utils.Iterable);
			expectList(fromObject({}), []);
			expectList(fromObject({true: true}), [['true', true]]);
			expectList(fromObject({x:1, y:2}, true), [['x',1], ['y',2]]);
			expectList(fromObject({a:'a', b:'b', c:'c'}, true), 
				[['a','a'], ['b','b'], ['c','c']]);
		});

		xit("`Iterable.toObject` function", function () {
			expect(list_utils.Iterable.prototype.toObject).toBeOfType('function');
			var fromValues = list_utils.Iterable.fromValues.bind(list_utils.Iterable);
			expect(fromValues().toObject())
				.toEqual({});
			expect(fromValues(['t',true]).toObject())
				.toEqual({t:true});
			expect(fromValues(['one',1], ['two',2]).toObject())
				.toEqual({one:1, two:2});
			expect(fromValues(['f1','a'], ['f2','b'], ['f3','c']).toObject())
				.toEqual({f1:'a', f2:'b', f3:'c'});
		});
	}); // describe "Lists from objects:"
}); //// define
