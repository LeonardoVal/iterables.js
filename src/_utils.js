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

function then(p, callback) {
	if (p instanceof Promise) {
		return p.then(callback);
	} else {
		return callback(p);
	}
}

function evalExp(code) {
	try {
		return eval('('+ code +')');
	} catch (error) {
		throw new Error('Error evaluating `'+ code +'`!', error);
	} 
}

function functionMatch(re, func) {
	var reMatch = re.exec(func +'');
	if (!reMatch) {
		throw new SyntaxError('Iterator function is not valid!\n```javascript\n\t'+ 
			(func +'').replace('\n', '\n\t') +'\n```');
	}
	return reMatch;
}

function $builderMethod(iteratorFunction, async) {
	var reMatch = functionMatch(/^function\s+(\w+)Iterator\(([^\)]*)\)/, iteratorFunction),
		id = reMatch[1],
		args = reMatch[2];
	iteratorFunction.isAsync = !!async;
	Iterable[id +'Iterator'] = iteratorFunction;
	Iterable[id] = evalExp('function '+ id +'('+ args +') {\n\treturn new Iterable(Iterable.'+ 
		id +'Iterator, '+ args +');\n}');
	return iteratorFunction;
}

function $subtype(iteratorFunction, async) {
	var reMatch = functionMatch(/^function\s+(\w+)Iterator\(([^\)]*)\)/, iteratorFunction),
		id = reMatch[1],
		args = reMatch[2];
	iteratorFunction.isAsync = !!async;
	Iterable[id +'Iterator'] = iteratorFunction;
	Iterable[id] = evalExp('function '+ id +'('+ args +') {\n\treturn new Iterable(Iterable.'+ 
		id +'Iterator, '+ args +');\n}');
	var classId = id.substr(0, 1).toUpperCase() + id.substr(1) + 'Iterable',
		constructorCode = 'function '+ classId +'('+ args +') {\n'+
			'\tIterable.call(this, Iterable.'+ id +'Iterator, '+ args +');\n'+
			args.split(/\s*,\s*/).map(function (arg) {
				return arg && '\tthis.__'+ arg +'__ = '+ arg +';\n';
			}).join() +'}',
		constructor = evalExp(constructorCode);
	exports[classId] = Iterable.subclass(constructor, {});
	return exports[classId];
}

function $methodOn1List(iteratorFunction, async) {
	var reMatch = functionMatch(/^function\s+(\w+)Iterator\(list(?:|,([^\)]+))\)/, iteratorFunction);
	if (!reMatch) {
		throw new SyntaxError('Iterator function is not valid!\n```javascript\n\t'+ 
			(iteratorFunction +''.replace('\n', '\n\t')) +'\n```');
	}
	var id = reMatch[1],
		args = reMatch[2];
	iteratorFunction.isAsync = !!async;
	Iterable[id +'Iterator'] = iteratorFunction;
	Iterable.prototype[id] = evalExp('function '+ id +'('+ args +') {\n\treturn new Iterable(Iterable.'+ 
		id +'Iterator, this, '+ args +');\n}');
}

function $methodOnNLists(iteratorFunction, async) {
	var reMatch = functionMatch(/^function\s+(\w+)Iterator\(lists(?:|,([^\)]+))\)/, iteratorFunction),
		id = reMatch[1],
		args = reMatch[2];
	iteratorFunction.isAsync = !!async;		
	Iterable[id +'Iterator'] = iteratorFunction;
	Iterable.prototype[id] = evalExp('function '+ id +'(lists, '+ args +') {\n'+
		'\treturn new Iterable(Iterable.'+ id +'Iterator, [this].concat(lists), '+ args +');\n}');
	Iterable[id] = evalExp('function '+ id +'(lists, '+ args +') {\n'+
		'\treturn new Iterable(Iterable.'+ id +'Iterator, lists, '+ args +');\n}');
}