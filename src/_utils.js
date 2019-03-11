/**
*/


function __toBool__(x) {
	return !!x;
}

function __toNumber__(x) {
	return +x;
}

function factorial(n, k) {
	k = Math.max(1, k |0);
	var r = 1;
	for (; n > k; n--) {
		r *= n;
	}
	return r;
}

function __id__(x) {
	return x;
}

function __iters__(lists, async) {
	return lists.map(function (list) {
		return __iter__(list, async);
	});
}

function k(value) {
	return function() { 
		return value; 
	};
}

function $builderMethod(iteratorFunction) {
	var reMatch = /^function\s+(\w+)Iterator\(([^)]+)\)/.exec(iteratorFunction +''),
		id = reMatch[1],
		args = reMatch[2];
	Iterable[id +'Iterator'] = iteratorFunction;
	Iterable[id] = eval('(function '+ id +'('+ args +') {\n\treturn new Iterable(Iterable.'+ 
		id +'Iterator, '+ args +');\n})');
}

function $methodOn1List(iteratorFunction) {
	var reMatch = /^function\s+(\w+)Iterator\(list,([^)]+)\)/.exec(iteratorFunction +''),
		id = reMatch[1],
		args = reMatch[2];
	Iterable[id +'Iterator'] = iteratorFunction;
	Iterable.prototype[id] = eval('(function '+ id +'('+ args +') {\n\treturn new Iterable(Iterable.'+ 
		id +'Iterator, this, '+ args +');\n})');
}

function $methodOnNLists(iteratorFunction) {
	var reMatch = /^function\s+(\w+)Iterator\(lists,([^)]+)\)/.exec(iteratorFunction +''),
		id = reMatch[1],
		args = reMatch[2];
	Iterable[id +'Iterator'] = iteratorFunction;
	Iterable[id] = eval('(function '+ id +'('+ args +') {\n\treturn new Iterable(Iterable.'+ 
		id +'Iterator, '+ args +');\n})');
}