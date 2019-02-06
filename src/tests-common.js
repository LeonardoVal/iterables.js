define([], function () {
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

	return {
		expectList: expectList,
		expectIterator: expectIterator
	};
});