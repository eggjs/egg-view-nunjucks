'use strict';

exports.repeatSync = function (field) {
	return field.repeat(2);
};

exports.repeatAsync = function* (field) {
	return yield new Promise((resolve, reject) => {
		setTimeout(() => resolve(field.repeat(2)), 1);
	});
};

// exports.repeatAsync = async function (field) {
// 	return await new Promise((resolve, reject) => {
// 		setTimeout(() => resolve(field.repeat(2)), 1);
// 	});
// };