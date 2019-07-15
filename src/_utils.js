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

function k(value) {
	return function() { 
		return value; 
	};
}