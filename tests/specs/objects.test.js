define(['list-utils', 'tests-common'], function (listUtils, test_common) { "use strict";
	var expectList = test_common.expectList;

	describe("Lists from objects:", function () {
		it("`Iterable.fromObject` function", function () {
			let Iterable = listUtils.Iterable,
				fromObject = Iterable.fromObject.bind(Iterable);
			expect(Iterable.fromObject).toBeOfType('function');
			expectList(fromObject({}), []);
			expectList(fromObject({true: true}), [['true', true]]);
			expectList(fromObject({x:1, y:2}, true), [['x',1], ['y',2]]);
			expectList(fromObject({a:'a', b:'b', c:'c'}, true), 
				[['a','a'], ['b','b'], ['c','c']]);
		});

		it("`Iterable.toObject` function", function () {
			let Iterable = listUtils.Iterable,
				fromValues = Iterable.fromValues.bind(Iterable);
			expect(Iterable.prototype.toObject).toBeOfType('function');
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
