/**
 */
class SingletonIterable extends Iterable {
	constructor (value) {
		let source = generators.singleton.bind(generators, value);
		super(source);
		this.__value__ = value;
	}

// Properties //////////////////////////////////////////////////////////////////

	/** @inheritdoc */
	isEmpty() {
		return false;
	}

	/** @inheritdoc */
	get length() {
		return 1;
	}

// Conversions /////////////////////////////////////////////////////////////////

	/** @inheritdoc */
	toArray(array) {
		return (array || []).concat([this.__value__]);
	}

} // class SingletonIterable

exports.SingletonIterable = SingletonIterable;