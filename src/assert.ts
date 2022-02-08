import chai = require('chai');

interface Assert {
	(expression: any, message?: string): asserts expression;
}

export const assert: Assert = chai.assert;
