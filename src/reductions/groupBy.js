/**
 */
(function () {
	function defaultGrouping(g, v, i) {
		g = g || [];
		g.push(v);
		return g;
	}

	if (MAP_TYPE_IS_DEFINED) {
		Iterable.prototype.groupBy = function groupBy(key, grouping) {
			grouping = grouping || defaultGrouping;
			return this.reduce(function (groupMap, value, i) {
				var k = key ? key(value, i) : value;
				groupMap.set(k, grouping(groupMap.get(k), value, i));
				return groupMap;
			}, new Map());
		};
	} else {
		Iterable.prototype.groupBy = function groupBy(key, grouping) {
			grouping = grouping || defaultGrouping;
			return this.reduce(function (groupMap, value, i) {
				var k = key ? key(value, i) : (value +'');
				groupMap[k] = grouping(groupMap[k], value, i);
				return groupMap;
			}, {});
		};
	}
})();
