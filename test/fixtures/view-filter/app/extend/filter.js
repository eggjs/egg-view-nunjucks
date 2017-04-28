'use strict';
const __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments)).next());
  });
};

exports.repeatSync = (field) => {
  return field.repeat(2);
};

exports.repeatAsync = function* (field) {
  return yield new Promise((resolve, reject) => {
    setTimeout(() => resolve(field.repeat(2)), 1);
  });
};

// for async test at node 6.x
exports.repeatAsyncNative = function (field) {
  return __awaiter(new Promise((resolve, reject) => {
    setTimeout(() => resolve(field.repeat(2)), 1);
  }));
};

exports.repeatError = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject('error'), 1);
  });
};

exports.fnError = () => {
  throw new Error('some filter error');
};