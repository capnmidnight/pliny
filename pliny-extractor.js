(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('fs'), require('path')) :
	typeof define === 'function' && define.amd ? define(['exports', 'fs', 'path'], factory) :
	(factory((global.plinyExtractor = global.plinyExtractor || {}),global.fs,global.path));
}(this, (function (exports,fs,path) { 'use strict';

fs = 'default' in fs ? fs['default'] : fs;
var path__default = 'default' in path ? path['default'] : path;

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/*!
 * filename-regex <https://github.com/regexps/filename-regex>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert
 * Licensed under the MIT license.
 */

var index$1 = function filenameRegex() {
  return /([^\\\/]+)$/;
};

/*!
 * arr-flatten <https://github.com/jonschlinkert/arr-flatten>
 *
 * Copyright (c) 2014-2015, 2017, Jon Schlinkert.
 * Released under the MIT License.
 */

var index$5 = function flatten(arr) {
  return flat(arr, []);
};

function flat(arr, acc) {
  var len = arr.length;
  var idx = -1;

  while (++idx < len) {
    var cur = arr[idx];
    if (Array.isArray(cur)) {
      flat(cur, acc);
    } else {
      acc.push(cur);
    }
  }
  return acc;
}

var slice = [].slice;

/**
 * Return the difference between the first array and
 * additional arrays.
 *
 * ```js
 * var diff = require('{%= name %}');
 *
 * var a = ['a', 'b', 'c', 'd'];
 * var b = ['b', 'c'];
 *
 * console.log(diff(a, b))
 * //=> ['a', 'd']
 * ```
 *
 * @param  {Array} `a`
 * @param  {Array} `b`
 * @return {Array}
 * @api public
 */

function diff(arr, arrays) {
  var argsLen = arguments.length;
  var len = arr.length, i = -1;
  var res = [], arrays;

  if (argsLen === 1) {
    return arr;
  }

  if (argsLen > 2) {
    arrays = index$5(slice.call(arguments, 1));
  }

  while (++i < len) {
    if (!~arrays.indexOf(arr[i])) {
      res.push(arr[i]);
    }
  }
  return res;
}

/**
 * Expose `diff`
 */

var index$3 = diff;

/*!
 * array-unique <https://github.com/jonschlinkert/array-unique>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

var index$7 = function unique(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError('array-unique expects an array.');
  }

  var len = arr.length;
  var i = -1;

  while (i++ < len) {
    var j = i + 1;

    for (; j < arr.length; ++j) {
      if (arr[i] === arr[j]) {
        arr.splice(j--, 1);
      }
    }
  }
  return arr;
};

var toString$1 = {}.toString;

var index$17 = Array.isArray || function (arr) {
  return toString$1.call(arr) == '[object Array]';
};

var index$15 = function isObject(val) {
  return val != null && typeof val === 'object' && index$17(val) === false;
};

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
var index$23 = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
};

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

var toString$2 = Object.prototype.toString;

/**
 * Get the native `typeof` a value.
 *
 * @param  {*} `val`
 * @return {*} Native javascript type
 */

var index$21 = function kindOf(val) {
  // primitivies
  if (typeof val === 'undefined') {
    return 'undefined';
  }
  if (val === null) {
    return 'null';
  }
  if (val === true || val === false || val instanceof Boolean) {
    return 'boolean';
  }
  if (typeof val === 'string' || val instanceof String) {
    return 'string';
  }
  if (typeof val === 'number' || val instanceof Number) {
    return 'number';
  }

  // functions
  if (typeof val === 'function' || val instanceof Function) {
    return 'function';
  }

  // array
  if (typeof Array.isArray !== 'undefined' && Array.isArray(val)) {
    return 'array';
  }

  // check for instances of RegExp and Date before calling `toString`
  if (val instanceof RegExp) {
    return 'regexp';
  }
  if (val instanceof Date) {
    return 'date';
  }

  // other objects
  var type = toString$2.call(val);

  if (type === '[object RegExp]') {
    return 'regexp';
  }
  if (type === '[object Date]') {
    return 'date';
  }
  if (type === '[object Arguments]') {
    return 'arguments';
  }
  if (type === '[object Error]') {
    return 'error';
  }

  // buffer
  if (index$23(val)) {
    return 'buffer';
  }

  // es6: Map, WeakMap, Set, WeakSet
  if (type === '[object Set]') {
    return 'set';
  }
  if (type === '[object WeakSet]') {
    return 'weakset';
  }
  if (type === '[object Map]') {
    return 'map';
  }
  if (type === '[object WeakMap]') {
    return 'weakmap';
  }
  if (type === '[object Symbol]') {
    return 'symbol';
  }

  // typed arrays
  if (type === '[object Int8Array]') {
    return 'int8array';
  }
  if (type === '[object Uint8Array]') {
    return 'uint8array';
  }
  if (type === '[object Uint8ClampedArray]') {
    return 'uint8clampedarray';
  }
  if (type === '[object Int16Array]') {
    return 'int16array';
  }
  if (type === '[object Uint16Array]') {
    return 'uint16array';
  }
  if (type === '[object Int32Array]') {
    return 'int32array';
  }
  if (type === '[object Uint32Array]') {
    return 'uint32array';
  }
  if (type === '[object Float32Array]') {
    return 'float32array';
  }
  if (type === '[object Float64Array]') {
    return 'float64array';
  }

  // must be a plain object
  return 'object';
};

var index$19 = function isNumber(num) {
  var type = index$21(num);
  if (type !== 'number' && type !== 'string') {
    return false;
  }
  var n = +num;
  return (n - n + 1) >= 0 && num !== '';
};

var toString$3 = Object.prototype.toString;

/**
 * Get the native `typeof` a value.
 *
 * @param  {*} `val`
 * @return {*} Native javascript type
 */

var index$29 = function kindOf(val) {
  // primitivies
  if (typeof val === 'undefined') {
    return 'undefined';
  }
  if (val === null) {
    return 'null';
  }
  if (val === true || val === false || val instanceof Boolean) {
    return 'boolean';
  }
  if (typeof val === 'string' || val instanceof String) {
    return 'string';
  }
  if (typeof val === 'number' || val instanceof Number) {
    return 'number';
  }

  // functions
  if (typeof val === 'function' || val instanceof Function) {
    return 'function';
  }

  // array
  if (typeof Array.isArray !== 'undefined' && Array.isArray(val)) {
    return 'array';
  }

  // check for instances of RegExp and Date before calling `toString`
  if (val instanceof RegExp) {
    return 'regexp';
  }
  if (val instanceof Date) {
    return 'date';
  }

  // other objects
  var type = toString$3.call(val);

  if (type === '[object RegExp]') {
    return 'regexp';
  }
  if (type === '[object Date]') {
    return 'date';
  }
  if (type === '[object Arguments]') {
    return 'arguments';
  }
  if (type === '[object Error]') {
    return 'error';
  }

  // buffer
  if (index$23(val)) {
    return 'buffer';
  }

  // es6: Map, WeakMap, Set, WeakSet
  if (type === '[object Set]') {
    return 'set';
  }
  if (type === '[object WeakSet]') {
    return 'weakset';
  }
  if (type === '[object Map]') {
    return 'map';
  }
  if (type === '[object WeakMap]') {
    return 'weakmap';
  }
  if (type === '[object Symbol]') {
    return 'symbol';
  }

  // typed arrays
  if (type === '[object Int8Array]') {
    return 'int8array';
  }
  if (type === '[object Uint8Array]') {
    return 'uint8array';
  }
  if (type === '[object Uint8ClampedArray]') {
    return 'uint8clampedarray';
  }
  if (type === '[object Int16Array]') {
    return 'int16array';
  }
  if (type === '[object Uint16Array]') {
    return 'uint16array';
  }
  if (type === '[object Int32Array]') {
    return 'int32array';
  }
  if (type === '[object Uint32Array]') {
    return 'uint32array';
  }
  if (type === '[object Float32Array]') {
    return 'float32array';
  }
  if (type === '[object Float64Array]') {
    return 'float64array';
  }

  // must be a plain object
  return 'object';
};

var index$27 = function isNumber(num) {
  var type = index$29(num);

  if (type === 'string') {
    if (!num.trim()) return false;
  } else if (type !== 'number') {
    return false;
  }

  return (num - num + 1) >= 0;
};

var toString$4 = Object.prototype.toString;

/**
 * Get the native `typeof` a value.
 *
 * @param  {*} `val`
 * @return {*} Native javascript type
 */

var index$31 = function kindOf(val) {
  // primitivies
  if (typeof val === 'undefined') {
    return 'undefined';
  }
  if (val === null) {
    return 'null';
  }
  if (val === true || val === false || val instanceof Boolean) {
    return 'boolean';
  }
  if (typeof val === 'string' || val instanceof String) {
    return 'string';
  }
  if (typeof val === 'number' || val instanceof Number) {
    return 'number';
  }

  // functions
  if (typeof val === 'function' || val instanceof Function) {
    return 'function';
  }

  // array
  if (typeof Array.isArray !== 'undefined' && Array.isArray(val)) {
    return 'array';
  }

  // check for instances of RegExp and Date before calling `toString`
  if (val instanceof RegExp) {
    return 'regexp';
  }
  if (val instanceof Date) {
    return 'date';
  }

  // other objects
  var type = toString$4.call(val);

  if (type === '[object RegExp]') {
    return 'regexp';
  }
  if (type === '[object Date]') {
    return 'date';
  }
  if (type === '[object Arguments]') {
    return 'arguments';
  }
  if (type === '[object Error]') {
    return 'error';
  }
  if (type === '[object Promise]') {
    return 'promise';
  }

  // buffer
  if (index$23(val)) {
    return 'buffer';
  }

  // es6: Map, WeakMap, Set, WeakSet
  if (type === '[object Set]') {
    return 'set';
  }
  if (type === '[object WeakSet]') {
    return 'weakset';
  }
  if (type === '[object Map]') {
    return 'map';
  }
  if (type === '[object WeakMap]') {
    return 'weakmap';
  }
  if (type === '[object Symbol]') {
    return 'symbol';
  }

  // typed arrays
  if (type === '[object Int8Array]') {
    return 'int8array';
  }
  if (type === '[object Uint8Array]') {
    return 'uint8array';
  }
  if (type === '[object Uint8ClampedArray]') {
    return 'uint8clampedarray';
  }
  if (type === '[object Int16Array]') {
    return 'int16array';
  }
  if (type === '[object Uint16Array]') {
    return 'uint16array';
  }
  if (type === '[object Int32Array]') {
    return 'int32array';
  }
  if (type === '[object Uint32Array]') {
    return 'uint32array';
  }
  if (type === '[object Float32Array]') {
    return 'float32array';
  }
  if (type === '[object Float64Array]') {
    return 'float64array';
  }

  // must be a plain object
  return 'object';
};

/**
 * Expose `randomatic`
 */

var index$25 = randomatic;

/**
 * Available mask characters
 */

var type = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  number: '0123456789',
  special: '~!@#$%^&()_+-={}[];\',.'
};

type.all = type.lower + type.upper + type.number + type.special;

/**
 * Generate random character sequences of a specified `length`,
 * based on the given `pattern`.
 *
 * @param {String} `pattern` The pattern to use for generating the random string.
 * @param {String} `length` The length of the string to generate.
 * @param {String} `options`
 * @return {String}
 * @api public
 */

function randomatic(pattern, length, options) {
  if (typeof pattern === 'undefined') {
    throw new Error('randomatic expects a string or number.');
  }

  var custom = false;
  if (arguments.length === 1) {
    if (typeof pattern === 'string') {
      length = pattern.length;

    } else if (index$27(pattern)) {
      options = {}; length = pattern; pattern = '*';
    }
  }

  if (index$31(length) === 'object' && length.hasOwnProperty('chars')) {
    options = length;
    pattern = options.chars;
    length = pattern.length;
    custom = true;
  }

  var opts = options || {};
  var mask = '';
  var res = '';

  // Characters to be used
  if (pattern.indexOf('?') !== -1) mask += opts.chars;
  if (pattern.indexOf('a') !== -1) mask += type.lower;
  if (pattern.indexOf('A') !== -1) mask += type.upper;
  if (pattern.indexOf('0') !== -1) mask += type.number;
  if (pattern.indexOf('!') !== -1) mask += type.special;
  if (pattern.indexOf('*') !== -1) mask += type.all;
  if (custom) mask += pattern;

  while (length--) {
    res += mask.charAt(parseInt(Math.random() * mask.length, 10));
  }
  return res;
}

/*!
 * repeat-string <https://github.com/jonschlinkert/repeat-string>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

/**
 * Results cache
 */

var res = '';
var cache;

/**
 * Expose `repeat`
 */

var index$33 = repeat;

/**
 * Repeat the given `string` the specified `number`
 * of times.
 *
 * **Example:**
 *
 * ```js
 * var repeat = require('repeat-string');
 * repeat('A', 5);
 * //=> AAAAA
 * ```
 *
 * @param {String} `string` The string to repeat
 * @param {Number} `number` The number of times to repeat the string
 * @return {String} Repeated string
 * @api public
 */

function repeat(str, num) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string');
  }

  // cover common, quick use cases
  if (num === 1) return str;
  if (num === 2) return str + str;

  var max = str.length * num;
  if (cache !== str || typeof cache === 'undefined') {
    cache = str;
    res = '';
  } else if (res.length >= max) {
    return res.substr(0, max);
  }

  while (max > res.length && num > 1) {
    if (num & 1) {
      res += str;
    }

    num >>= 1;
    str += str;
  }

  res += str;
  res = res.substr(0, max);
  return res;
}

/*!
 * repeat-element <https://github.com/jonschlinkert/repeat-element>
 *
 * Copyright (c) 2015 Jon Schlinkert.
 * Licensed under the MIT license.
 */

var index$35 = function repeat(ele, num) {
  var arr = new Array(num);

  for (var i = 0; i < num; i++) {
    arr[i] = ele;
  }

  return arr;
};

/**
 * Expose `fillRange`
 */

var index$13 = fillRange;

/**
 * Return a range of numbers or letters.
 *
 * @param  {String} `a` Start of the range
 * @param  {String} `b` End of the range
 * @param  {String} `step` Increment or decrement to use.
 * @param  {Function} `fn` Custom function to modify each element in the range.
 * @return {Array}
 */

function fillRange(a, b, step, options, fn) {
  if (a == null || b == null) {
    throw new Error('fill-range expects the first and second args to be strings.');
  }

  if (typeof step === 'function') {
    fn = step; options = {}; step = null;
  }

  if (typeof options === 'function') {
    fn = options; options = {};
  }

  if (index$15(step)) {
    options = step; step = '';
  }

  var expand, regex = false, sep$$1 = '';
  var opts = options || {};

  if (typeof opts.silent === 'undefined') {
    opts.silent = true;
  }

  step = step || opts.step;

  // store a ref to unmodified arg
  var origA = a, origB = b;

  b = (b.toString() === '-0') ? 0 : b;

  if (opts.optimize || opts.makeRe) {
    step = step ? (step += '~') : step;
    expand = true;
    regex = true;
    sep$$1 = '~';
  }

  // handle special step characters
  if (typeof step === 'string') {
    var match = stepRe().exec(step);

    if (match) {
      var i = match.index;
      var m = match[0];

      // repeat string
      if (m === '+') {
        return index$35(a, b);

      // randomize a, `b` times
      } else if (m === '?') {
        return [index$25(a, b)];

      // expand right, no regex reduction
      } else if (m === '>') {
        step = step.substr(0, i) + step.substr(i + 1);
        expand = true;

      // expand to an array, or if valid create a reduced
      // string for a regex logic `or`
      } else if (m === '|') {
        step = step.substr(0, i) + step.substr(i + 1);
        expand = true;
        regex = true;
        sep$$1 = m;

      // expand to an array, or if valid create a reduced
      // string for a regex range
      } else if (m === '~') {
        step = step.substr(0, i) + step.substr(i + 1);
        expand = true;
        regex = true;
        sep$$1 = m;
      }
    } else if (!index$19(step)) {
      if (!opts.silent) {
        throw new TypeError('fill-range: invalid step.');
      }
      return null;
    }
  }

  if (/[.&*()[\]^%$#@!]/.test(a) || /[.&*()[\]^%$#@!]/.test(b)) {
    if (!opts.silent) {
      throw new RangeError('fill-range: invalid range arguments.');
    }
    return null;
  }

  // has neither a letter nor number, or has both letters and numbers
  // this needs to be after the step logic
  if (!noAlphaNum(a) || !noAlphaNum(b) || hasBoth(a) || hasBoth(b)) {
    if (!opts.silent) {
      throw new RangeError('fill-range: invalid range arguments.');
    }
    return null;
  }

  // validate arguments
  var isNumA = index$19(zeros(a));
  var isNumB = index$19(zeros(b));

  if ((!isNumA && isNumB) || (isNumA && !isNumB)) {
    if (!opts.silent) {
      throw new TypeError('fill-range: first range argument is incompatible with second.');
    }
    return null;
  }

  // by this point both are the same, so we
  // can use A to check going forward.
  var isNum = isNumA;
  var num = formatStep(step);

  // is the range alphabetical? or numeric?
  if (isNum) {
    // if numeric, coerce to an integer
    a = +a; b = +b;
  } else {
    // otherwise, get the charCode to expand alpha ranges
    a = a.charCodeAt(0);
    b = b.charCodeAt(0);
  }

  // is the pattern descending?
  var isDescending = a > b;

  // don't create a character class if the args are < 0
  if (a < 0 || b < 0) {
    expand = false;
    regex = false;
  }

  // detect padding
  var padding = isPadded(origA, origB);
  var res, pad, arr = [];
  var ii = 0;

  // character classes, ranges and logical `or`
  if (regex) {
    if (shouldExpand(a, b, num, isNum, padding, opts)) {
      // make sure the correct separator is used
      if (sep$$1 === '|' || sep$$1 === '~') {
        sep$$1 = detectSeparator(a, b, num, isNum, isDescending);
      }
      return wrap$1([origA, origB], sep$$1, opts);
    }
  }

  while (isDescending ? (a >= b) : (a <= b)) {
    if (padding && isNum) {
      pad = padding(a);
    }

    // custom function
    if (typeof fn === 'function') {
      res = fn(a, isNum, pad, ii++);

    // letters
    } else if (!isNum) {
      if (regex && isInvalidChar(a)) {
        res = null;
      } else {
        res = String.fromCharCode(a);
      }

    // numbers
    } else {
      res = formatPadding(a, pad);
    }

    // add result to the array, filtering any nulled values
    if (res !== null) arr.push(res);

    // increment or decrement
    if (isDescending) {
      a -= num;
    } else {
      a += num;
    }
  }

  // now that the array is expanded, we need to handle regex
  // character classes, ranges or logical `or` that wasn't
  // already handled before the loop
  if ((regex || expand) && !opts.noexpand) {
    // make sure the correct separator is used
    if (sep$$1 === '|' || sep$$1 === '~') {
      sep$$1 = detectSeparator(a, b, num, isNum, isDescending);
    }
    if (arr.length === 1 || a < 0 || b < 0) { return arr; }
    return wrap$1(arr, sep$$1, opts);
  }

  return arr;
}

/**
 * Wrap the string with the correct regex
 * syntax.
 */

function wrap$1(arr, sep$$1, opts) {
  if (sep$$1 === '~') { sep$$1 = '-'; }
  var str = arr.join(sep$$1);
  var pre = opts && opts.regexPrefix;

  // regex logical `or`
  if (sep$$1 === '|') {
    str = pre ? pre + str : str;
    str = '(' + str + ')';
  }

  // regex character class
  if (sep$$1 === '-') {
    str = (pre && pre === '^')
      ? pre + str
      : str;
    str = '[' + str + ']';
  }
  return [str];
}

/**
 * Check for invalid characters
 */

function isCharClass(a, b, step, isNum, isDescending) {
  if (isDescending) { return false; }
  if (isNum) { return a <= 9 && b <= 9; }
  if (a < b) { return step === 1; }
  return false;
}

/**
 * Detect the correct separator to use
 */

function shouldExpand(a, b, num, isNum, padding, opts) {
  if (isNum && (a > 9 || b > 9)) { return false; }
  return !padding && num === 1 && a < b;
}

/**
 * Detect the correct separator to use
 */

function detectSeparator(a, b, step, isNum, isDescending) {
  var isChar = isCharClass(a, b, step, isNum, isDescending);
  if (!isChar) {
    return '|';
  }
  return '~';
}

/**
 * Correctly format the step based on type
 */

function formatStep(step) {
  return Math.abs(step >> 0) || 1;
}

/**
 * Format padding, taking leading `-` into account
 */

function formatPadding(ch, pad) {
  var res = pad ? pad + ch : ch;
  if (pad && ch.toString().charAt(0) === '-') {
    res = '-' + pad + ch.toString().substr(1);
  }
  return res.toString();
}

/**
 * Check for invalid characters
 */

function isInvalidChar(str) {
  var ch = toStr(str);
  return ch === '\\'
    || ch === '['
    || ch === ']'
    || ch === '^'
    || ch === '('
    || ch === ')'
    || ch === '`';
}

/**
 * Convert to a string from a charCode
 */

function toStr(ch) {
  return String.fromCharCode(ch);
}


/**
 * Step regex
 */

function stepRe() {
  return /\?|>|\||\+|\~/g;
}

/**
 * Return true if `val` has either a letter
 * or a number
 */

function noAlphaNum(val) {
  return /[a-z0-9]/i.test(val);
}

/**
 * Return true if `val` has both a letter and
 * a number (invalid)
 */

function hasBoth(val) {
  return /[a-z][0-9]|[0-9][a-z]/i.test(val);
}

/**
 * Normalize zeros for checks
 */

function zeros(val) {
  if (/^-*0+$/.test(val.toString())) {
    return '0';
  }
  return val;
}

/**
 * Return true if `val` has leading zeros,
 * or a similar valid pattern.
 */

function hasZeros(val) {
  return /[^.]\.|^-*0+[0-9]/.test(val);
}

/**
 * If the string is padded, returns a curried function with
 * the a cached padding string, or `false` if no padding.
 *
 * @param  {*} `origA` String or number.
 * @return {String|Boolean}
 */

function isPadded(origA, origB) {
  if (hasZeros(origA) || hasZeros(origB)) {
    var alen = length(origA);
    var blen = length(origB);

    var len = alen >= blen
      ? alen
      : blen;

    return function (a) {
      return index$33('0', len - length(a));
    };
  }
  return false;
}

/**
 * Get the string length of `val`
 */

function length(val) {
  return val.toString().length;
}

var index$11 = function expandRange(str, options, fn) {
  if (typeof str !== 'string') {
    throw new TypeError('expand-range expects a string.');
  }

  if (typeof options === 'function') {
    fn = options;
    options = {};
  }

  if (typeof options === 'boolean') {
    options = {};
    options.makeRe = true;
  }

  // create arguments to pass to fill-range
  var opts = options || {};
  var args = str.split('..');
  var len = args.length;
  if (len > 3) { return str; }

  // if only one argument, it can't expand so return it
  if (len === 1) { return args; }

  // if `true`, tell fill-range to regexify the string
  if (typeof fn === 'boolean' && fn === true) {
    opts.makeRe = true;
  }

  args.push(opts);
  return index$13.apply(null, args.concat(fn));
};

/*!
 * preserve <https://github.com/jonschlinkert/preserve>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT license.
 */

/**
 * Replace tokens in `str` with a temporary, heuristic placeholder.
 *
 * ```js
 * tokens.before('{a\\,b}');
 * //=> '{__ID1__}'
 * ```
 *
 * @param  {String} `str`
 * @return {String} String with placeholders.
 * @api public
 */

var before = function before(str, re) {
  return str.replace(re, function (match) {
    var id = randomize$1();
    cache$1[id] = match;
    return '__ID' + id + '__';
  });
};

/**
 * Replace placeholders in `str` with original tokens.
 *
 * ```js
 * tokens.after('{__ID1__}');
 * //=> '{a\\,b}'
 * ```
 *
 * @param  {String} `str` String with placeholders
 * @return {String} `str` String with original tokens.
 * @api public
 */

var after = function after(str) {
  return str.replace(/__ID(.{5})__/g, function (_, id) {
    return cache$1[id];
  });
};

function randomize$1() {
  return Math.random().toString().slice(2, 7);
}

var cache$1 = {};

var index$37 = {
	before: before,
	after: after
};

/**
 * Module dependencies
 */





/**
 * Expose `braces`
 */

var index$9 = function(str, options) {
  if (typeof str !== 'string') {
    throw new Error('braces expects a string');
  }
  return braces(str, options);
};

/**
 * Expand `{foo,bar}` or `{1..5}` braces in the
 * given `string`.
 *
 * @param  {String} `str`
 * @param  {Array} `arr`
 * @param  {Object} `options`
 * @return {Array}
 */

function braces(str, arr, options) {
  if (str === '') {
    return [];
  }

  if (!Array.isArray(arr)) {
    options = arr;
    arr = [];
  }

  var opts = options || {};
  arr = arr || [];

  if (typeof opts.nodupes === 'undefined') {
    opts.nodupes = true;
  }

  var fn = opts.fn;
  var es6;

  if (typeof opts === 'function') {
    fn = opts;
    opts = {};
  }

  if (!(patternRe instanceof RegExp)) {
    patternRe = patternRegex();
  }

  var matches = str.match(patternRe) || [];
  var m = matches[0];

  switch(m) {
    case '\\,':
      return escapeCommas(str, arr, opts);
    case '\\.':
      return escapeDots(str, arr, opts);
    case '\/.':
      return escapePaths(str, arr, opts);
    case ' ':
      return splitWhitespace(str);
    case '{,}':
      return exponential(str, opts, braces);
    case '{}':
      return emptyBraces(str, arr, opts);
    case '\\{':
    case '\\}':
      return escapeBraces(str, arr, opts);
    case '${':
      if (!/\{[^{]+\{/.test(str)) {
        return arr.concat(str);
      } else {
        es6 = true;
        str = index$37.before(str, es6Regex());
      }
  }

  if (!(braceRe instanceof RegExp)) {
    braceRe = braceRegex();
  }

  var match = braceRe.exec(str);
  if (match == null) {
    return [str];
  }

  var outter = match[1];
  var inner = match[2];
  if (inner === '') { return [str]; }

  var segs, segsLength;

  if (inner.indexOf('..') !== -1) {
    segs = index$11(inner, opts, fn) || inner.split(',');
    segsLength = segs.length;

  } else if (inner[0] === '"' || inner[0] === '\'') {
    return arr.concat(str.split(/['"]/).join(''));

  } else {
    segs = inner.split(',');
    if (opts.makeRe) {
      return braces(str.replace(outter, wrap(segs, '|')), opts);
    }

    segsLength = segs.length;
    if (segsLength === 1 && opts.bash) {
      segs[0] = wrap(segs[0], '\\');
    }
  }

  var len = segs.length;
  var i = 0, val;

  while (len--) {
    var path$$1 = segs[i++];

    if (/(\.[^.\/])/.test(path$$1)) {
      if (segsLength > 1) {
        return segs;
      } else {
        return [str];
      }
    }

    val = splice(str, outter, path$$1);

    if (/\{[^{}]+?\}/.test(val)) {
      arr = braces(val, arr, opts);
    } else if (val !== '') {
      if (opts.nodupes && arr.indexOf(val) !== -1) { continue; }
      arr.push(es6 ? index$37.after(val) : val);
    }
  }

  if (opts.strict) { return filter$1(arr, filterEmpty); }
  return arr;
}

/**
 * Expand exponential ranges
 *
 *   `a{,}{,}` => ['a', 'a', 'a', 'a']
 */

function exponential(str, options, fn) {
  if (typeof options === 'function') {
    fn = options;
    options = null;
  }

  var opts = options || {};
  var esc = '__ESC_EXP__';
  var exp = 0;
  var res;

  var parts = str.split('{,}');
  if (opts.nodupes) {
    return fn(parts.join(''), opts);
  }

  exp = parts.length - 1;
  res = fn(parts.join(esc), opts);
  var len = res.length;
  var arr = [];
  var i = 0;

  while (len--) {
    var ele = res[i++];
    var idx = ele.indexOf(esc);

    if (idx === -1) {
      arr.push(ele);

    } else {
      ele = ele.split('__ESC_EXP__').join('');
      if (!!ele && opts.nodupes !== false) {
        arr.push(ele);

      } else {
        var num = Math.pow(2, exp);
        arr.push.apply(arr, index$35(ele, num));
      }
    }
  }
  return arr;
}

/**
 * Wrap a value with parens, brackets or braces,
 * based on the given character/separator.
 *
 * @param  {String|Array} `val`
 * @param  {String} `ch`
 * @return {String}
 */

function wrap(val, ch) {
  if (ch === '|') {
    return '(' + val.join(ch) + ')';
  }
  if (ch === ',') {
    return '{' + val.join(ch) + '}';
  }
  if (ch === '-') {
    return '[' + val.join(ch) + ']';
  }
  if (ch === '\\') {
    return '\\{' + val + '\\}';
  }
}

/**
 * Handle empty braces: `{}`
 */

function emptyBraces(str, arr, opts) {
  return braces(str.split('{}').join('\\{\\}'), arr, opts);
}

/**
 * Filter out empty-ish values
 */

function filterEmpty(ele) {
  return !!ele && ele !== '\\';
}

/**
 * Handle patterns with whitespace
 */

function splitWhitespace(str) {
  var segs = str.split(' ');
  var len = segs.length;
  var res = [];
  var i = 0;

  while (len--) {
    res.push.apply(res, braces(segs[i++]));
  }
  return res;
}

/**
 * Handle escaped braces: `\\{foo,bar}`
 */

function escapeBraces(str, arr, opts) {
  if (!/\{[^{]+\{/.test(str)) {
    return arr.concat(str.split('\\').join(''));
  } else {
    str = str.split('\\{').join('__LT_BRACE__');
    str = str.split('\\}').join('__RT_BRACE__');
    return map(braces(str, arr, opts), function(ele) {
      ele = ele.split('__LT_BRACE__').join('{');
      return ele.split('__RT_BRACE__').join('}');
    });
  }
}

/**
 * Handle escaped dots: `{1\\.2}`
 */

function escapeDots(str, arr, opts) {
  if (!/[^\\]\..+\\\./.test(str)) {
    return arr.concat(str.split('\\').join(''));
  } else {
    str = str.split('\\.').join('__ESC_DOT__');
    return map(braces(str, arr, opts), function(ele) {
      return ele.split('__ESC_DOT__').join('.');
    });
  }
}

/**
 * Handle escaped dots: `{1\\.2}`
 */

function escapePaths(str, arr, opts) {
  str = str.split('\/.').join('__ESC_PATH__');
  return map(braces(str, arr, opts), function(ele) {
    return ele.split('__ESC_PATH__').join('\/.');
  });
}

/**
 * Handle escaped commas: `{a\\,b}`
 */

function escapeCommas(str, arr, opts) {
  if (!/\w,/.test(str)) {
    return arr.concat(str.split('\\').join(''));
  } else {
    str = str.split('\\,').join('__ESC_COMMA__');
    return map(braces(str, arr, opts), function(ele) {
      return ele.split('__ESC_COMMA__').join(',');
    });
  }
}

/**
 * Regex for common patterns
 */

function patternRegex() {
  return /\${|( (?=[{,}])|(?=[{,}]) )|{}|{,}|\\,(?=.*[{}])|\/\.(?=.*[{}])|\\\.(?={)|\\{|\\}/;
}

/**
 * Braces regex.
 */

function braceRegex() {
  return /.*(\\?\{([^}]+)\})/;
}

/**
 * es6 delimiter regex.
 */

function es6Regex() {
  return /\$\{([^}]+)\}/;
}

var braceRe;
var patternRe;

/**
 * Faster alternative to `String.replace()` when the
 * index of the token to be replaces can't be supplied
 */

function splice(str, token, replacement) {
  var i = str.indexOf(token);
  return str.substr(0, i) + replacement
    + str.substr(i + token.length);
}

/**
 * Fast array map
 */

function map(arr, fn) {
  if (arr == null) {
    return [];
  }

  var len = arr.length;
  var res = new Array(len);
  var i = -1;

  while (++i < len) {
    res[i] = fn(arr[i], i, arr);
  }

  return res;
}

/**
 * Fast array filter
 */

function filter$1(arr, cb) {
  if (arr == null) return [];
  if (typeof cb !== 'function') {
    throw new TypeError('braces: filter expects a callback function.');
  }

  var len = arr.length;
  var res = arr.slice();
  var i = 0;

  while (len--) {
    if (!cb(arr[len], i++)) {
      res.splice(len, 1);
    }
  }
  return res;
}

/*!
 * is-posix-bracket <https://github.com/jonschlinkert/is-posix-bracket>
 *
 * Copyright (c) 2015-2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

var index$41 = function isPosixBracket(str) {
  return typeof str === 'string' && /\[([:.=+])(?:[^\[\]]|)+\1\]/.test(str);
};

/**
 * POSIX character classes
 */

var POSIX = {
  alnum: 'a-zA-Z0-9',
  alpha: 'a-zA-Z',
  blank: ' \\t',
  cntrl: '\\x00-\\x1F\\x7F',
  digit: '0-9',
  graph: '\\x21-\\x7E',
  lower: 'a-z',
  print: '\\x20-\\x7E',
  punct: '-!"#$%&\'()\\*+,./:;<=>?@[\\]^_`{|}~',
  space: ' \\t\\r\\n\\v\\f',
  upper: 'A-Z',
  word:  'A-Za-z0-9_',
  xdigit: 'A-Fa-f0-9',
};

/**
 * Expose `brackets`
 */

var index$39 = brackets;

function brackets(str) {
  if (!index$41(str)) {
    return str;
  }

  var negated = false;
  if (str.indexOf('[^') !== -1) {
    negated = true;
    str = str.split('[^').join('[');
  }
  if (str.indexOf('[!') !== -1) {
    negated = true;
    str = str.split('[!').join('[');
  }

  var a = str.split('[');
  var b = str.split(']');
  var imbalanced = a.length !== b.length;

  var parts = str.split(/(?::\]\[:|\[?\[:|:\]\]?)/);
  var len = parts.length, i = 0;
  var end = '', beg = '';
  var res = [];

  // start at the end (innermost) first
  while (len--) {
    var inner = parts[i++];
    if (inner === '^[!' || inner === '[!') {
      inner = '';
      negated = true;
    }

    var prefix = negated ? '^' : '';
    var ch = POSIX[inner];

    if (ch) {
      res.push('[' + prefix + ch + ']');
    } else if (inner) {
      if (/^\[?\w-\w\]?$/.test(inner)) {
        if (i === parts.length) {
          res.push('[' + prefix + inner);
        } else if (i === 1) {
          res.push(prefix + inner + ']');
        } else {
          res.push(prefix + inner);
        }
      } else {
        if (i === 1) {
          beg += inner;
        } else if (i === parts.length) {
          end += inner;
        } else {
          res.push('[' + prefix + inner + ']');
        }
      }
    }
  }

  var result = res.join('|');
  var rlen = res.length || 1;
  if (rlen > 1) {
    result = '(?:' + result + ')';
    rlen = 1;
  }
  if (beg) {
    rlen++;
    if (beg.charAt(0) === '[') {
      if (imbalanced) {
        beg = '\\[' + beg.slice(1);
      } else {
        beg += ']';
      }
    }
    result = beg + result;
  }
  if (end) {
    rlen++;
    if (end.slice(-1) === ']') {
      if (imbalanced) {
        end = end.slice(0, end.length - 1) + '\\]';
      } else {
        end = '[' + end;
      }
    }
    result += end;
  }

  if (rlen > 1) {
    result = result.split('][').join(']|[');
    if (result.indexOf('|') !== -1 && !/\(\?/.test(result)) {
      result = '(?:' + result + ')';
    }
  }

  result = result.replace(/\[+=|=\]+/g, '\\b');
  return result;
}

brackets.makeRe = function(pattern) {
  try {
    return new RegExp(brackets(pattern));
  } catch (err) {}
};

brackets.isMatch = function(str, pattern) {
  try {
    return brackets.makeRe(pattern).test(str);
  } catch (err) {
    return false;
  }
};

brackets.match = function(arr, pattern) {
  var len = arr.length, i = 0;
  var res = arr.slice();

  var re = brackets.makeRe(pattern);
  while (i < len) {
    var ele = arr[i++];
    if (!re.test(ele)) {
      continue;
    }
    res.splice(i, 1);
  }
  return res;
};

/*!
 * is-extglob <https://github.com/jonschlinkert/is-extglob>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

var index$45 = function isExtglob(str) {
  return typeof str === 'string'
    && /[@?!+*]\(/.test(str);
};

/**
 * Module dependencies
 */


var re;
var cache$2 = {};

/**
 * Expose `extglob`
 */

var index$43 = extglob;

/**
 * Convert the given extglob `string` to a regex-compatible
 * string.
 *
 * ```js
 * var extglob = require('extglob');
 * extglob('!(a?(b))');
 * //=> '(?!a(?:b)?)[^/]*?'
 * ```
 *
 * @param {String} `str` The string to convert.
 * @param {Object} `options`
 *   @option {Boolean} [options] `esc` If `false` special characters will not be escaped. Defaults to `true`.
 *   @option {Boolean} [options] `regex` If `true` a regular expression is returned instead of a string.
 * @return {String}
 * @api public
 */


function extglob(str, opts) {
  opts = opts || {};
  var o = {}, i = 0;

  // fix common character reversals
  // '*!(.js)' => '*.!(js)'
  str = str.replace(/!\(([^\w*()])/g, '$1!(');

  // support file extension negation
  str = str.replace(/([*\/])\.!\([*]\)/g, function (m, ch) {
    if (ch === '/') {
      return escape('\\/[^.]+');
    }
    return escape('[^.]+');
  });

  // create a unique key for caching by
  // combining the string and options
  var key = str
    + String(!!opts.regex)
    + String(!!opts.contains)
    + String(!!opts.escape);

  if (cache$2.hasOwnProperty(key)) {
    return cache$2[key];
  }

  if (!(re instanceof RegExp)) {
    re = regex();
  }

  opts.negate = false;
  var m;

  while (m = re.exec(str)) {
    var prefix = m[1];
    var inner = m[3];
    if (prefix === '!') {
      opts.negate = true;
    }

    var id = '__EXTGLOB_' + (i++) + '__';
    // use the prefix of the _last_ (outtermost) pattern
    o[id] = wrap$2(inner, prefix, opts.escape);
    str = str.split(m[0]).join(id);
  }

  var keys = Object.keys(o);
  var len = keys.length;

  // we have to loop again to allow us to convert
  // patterns in reverse order (starting with the
  // innermost/last pattern first)
  while (len--) {
    var prop = keys[len];
    str = str.split(prop).join(o[prop]);
  }

  var result = opts.regex
    ? toRegex$1(str, opts.contains, opts.negate)
    : str;

  result = result.split('.').join('\\.');

  // cache the result and return it
  return (cache$2[key] = result);
}

/**
 * Convert `string` to a regex string.
 *
 * @param  {String} `str`
 * @param  {String} `prefix` Character that determines how to wrap the string.
 * @param  {Boolean} `esc` If `false` special characters will not be escaped. Defaults to `true`.
 * @return {String}
 */

function wrap$2(inner, prefix, esc) {
  if (esc) inner = escape(inner);

  switch (prefix) {
    case '!':
      return '(?!' + inner + ')[^/]' + (esc ? '%%%~' : '*?');
    case '@':
      return '(?:' + inner + ')';
    case '+':
      return '(?:' + inner + ')+';
    case '*':
      return '(?:' + inner + ')' + (esc ? '%%' : '*')
    case '?':
      return '(?:' + inner + '|)';
    default:
      return inner;
  }
}

function escape(str) {
  str = str.split('*').join('[^/]%%%~');
  str = str.split('.').join('\\.');
  return str;
}

/**
 * extglob regex.
 */

function regex() {
  return /(\\?[@?!+*$]\\?)(\(([^()]*?)\))/;
}

/**
 * Negation regex
 */

function negate(str) {
  return '(?!^' + str + ').*$';
}

/**
 * Create the regex to do the matching. If
 * the leading character in the `pattern` is `!`
 * a negation regex is returned.
 *
 * @param {String} `pattern`
 * @param {Boolean} `contains` Allow loose matching.
 * @param {Boolean} `isNegated` True if the pattern is a negation pattern.
 */

function toRegex$1(pattern, contains, isNegated) {
  var prefix = contains ? '^' : '';
  var after = contains ? '$' : '';
  pattern = ('(?:' + pattern + ')' + after);
  if (isNegated) {
    pattern = prefix + negate(pattern);
  }
  return new RegExp(prefix + pattern);
}

/*!
 * is-glob <https://github.com/jonschlinkert/is-glob>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */



var index$47 = function isGlob(str) {
  return typeof str === 'string'
    && (/[*!?{}(|)[\]]/.test(str)
     || index$45(str));
};

var isWin = process.platform === 'win32';

var index$51 = function (str) {
	while (endsInSeparator(str)) {
		str = str.slice(0, -1);
	}
	return str;
};

function endsInSeparator(str) {
	var last = str[str.length - 1];
	return str.length > 1 && (last === '/' || (isWin && last === '\\'));
}

/*!
 * normalize-path <https://github.com/jonschlinkert/normalize-path>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */



var index$49 = function normalizePath(str, stripTrailing) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string');
  }
  str = str.replace(/[\\\/]+/g, '/');
  if (stripTrailing !== false) {
    str = index$51(str);
  }
  return str;
};

/*!
 * is-extendable <https://github.com/jonschlinkert/is-extendable>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

var index$55 = function isExtendable(val) {
  return typeof val !== 'undefined' && val !== null
    && (typeof val === 'object' || typeof val === 'function');
};

/*!
 * for-in <https://github.com/jonschlinkert/for-in>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

var index$59 = function forIn(obj, fn, thisArg) {
  for (var key in obj) {
    if (fn.call(thisArg, obj[key], key, obj) === false) {
      break;
    }
  }
};

var hasOwn = Object.prototype.hasOwnProperty;

var index$57 = function forOwn(obj, fn, thisArg) {
  index$59(obj, function(val, key) {
    if (hasOwn.call(obj, key)) {
      return fn.call(thisArg, obj[key], key, obj);
    }
  });
};

var index$53 = function omit(obj, keys) {
  if (!index$55(obj)) return {};

  keys = [].concat.apply([], [].slice.call(arguments, 1));
  var last = keys[keys.length - 1];
  var res = {}, fn;

  if (typeof last === 'function') {
    fn = keys.pop();
  }

  var isFunction = typeof fn === 'function';
  if (!keys.length && !isFunction) {
    return obj;
  }

  index$57(obj, function(value, key) {
    if (keys.indexOf(key) === -1) {

      if (!isFunction) {
        res[key] = value;
      } else if (fn(value, key, obj)) {
        res[key] = value;
      }
    }
  });
  return res;
};

var index$65 = function globParent(str) {
	str += 'a'; // preserves full path in case of trailing path separator
	do {str = path__default.dirname(str);} while (index$47(str));
	return str;
};

var index$63 = function globBase(pattern) {
  if (typeof pattern !== 'string') {
    throw new TypeError('glob-base expects a string.');
  }

  var res = {};
  res.base = index$65(pattern);
  res.isGlob = index$47(pattern);

  if (res.base !== '.') {
    res.glob = pattern.substr(res.base.length);
    if (res.glob.charAt(0) === '/') {
      res.glob = res.glob.substr(1);
    }
  } else {
    res.glob = pattern;
  }

  if (!res.isGlob) {
    res.base = dirname(pattern);
    res.glob = res.base !== '.'
      ? pattern.substr(res.base.length)
      : pattern;
  }

  if (res.glob.substr(0, 2) === './') {
    res.glob = res.glob.substr(2);
  }
  if (res.glob.charAt(0) === '/') {
    res.glob = res.glob.substr(1);
  }
  return res;
};

function dirname(glob) {
  if (glob.slice(-1) === '/') return glob;
  return path__default.dirname(glob);
}

/*!
 * is-dotfile <https://github.com/jonschlinkert/is-dotfile>
 *
 * Copyright (c) 2015-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

var index$67 = function(str) {
  if (str.charCodeAt(0) === 46 /* . */ && str.indexOf('/', 1) === -1) {
    return true;
  }
  var slash = str.lastIndexOf('/');
  return slash !== -1 ? str.charCodeAt(slash + 1) === 46  /* . */ : false;
};

var index$61 = createCommonjsModule(function (module) {
/*!
 * parse-glob <https://github.com/jonschlinkert/parse-glob>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';






/**
 * Expose `cache`
 */

var cache = module.exports.cache = {};

/**
 * Parse a glob pattern into tokens.
 *
 * When no paths or '**' are in the glob, we use a
 * different strategy for parsing the filename, since
 * file names can contain braces and other difficult
 * patterns. such as:
 *
 *  - `*.{a,b}`
 *  - `(**|*.js)`
 */

module.exports = function parseGlob(glob) {
  if (cache.hasOwnProperty(glob)) {
    return cache[glob];
  }

  var tok = {};
  tok.orig = glob;
  tok.is = {};

  // unescape dots and slashes in braces/brackets
  glob = escape(glob);

  var parsed = index$63(glob);
  tok.is.glob = parsed.isGlob;

  tok.glob = parsed.glob;
  tok.base = parsed.base;
  var segs = /([^\/]*)$/.exec(glob);

  tok.path = {};
  tok.path.dirname = '';
  tok.path.basename = segs[1] || '';
  tok.path.dirname = glob.split(tok.path.basename).join('') || '';
  var basename = (tok.path.basename || '').split('.') || '';
  tok.path.filename = basename[0] || '';
  tok.path.extname = basename.slice(1).join('.') || '';
  tok.path.ext = '';

  if (index$47(tok.path.dirname) && !tok.path.basename) {
    if (!/\/$/.test(tok.glob)) {
      tok.path.basename = tok.glob;
    }
    tok.path.dirname = tok.base;
  }

  if (glob.indexOf('/') === -1 && !tok.is.globstar) {
    tok.path.dirname = '';
    tok.path.basename = tok.orig;
  }

  var dot = tok.path.basename.indexOf('.');
  if (dot !== -1) {
    tok.path.filename = tok.path.basename.slice(0, dot);
    tok.path.extname = tok.path.basename.slice(dot);
  }

  if (tok.path.extname.charAt(0) === '.') {
    var exts = tok.path.extname.split('.');
    tok.path.ext = exts[exts.length - 1];
  }

  // unescape dots and slashes in braces/brackets
  tok.glob = unescape(tok.glob);
  tok.path.dirname = unescape(tok.path.dirname);
  tok.path.basename = unescape(tok.path.basename);
  tok.path.filename = unescape(tok.path.filename);
  tok.path.extname = unescape(tok.path.extname);

  // Booleans
  var is = (glob && tok.is.glob);
  tok.is.negated  = glob && glob.charAt(0) === '!';
  tok.is.extglob  = glob && index$45(glob);
  tok.is.braces   = has(is, glob, '{');
  tok.is.brackets = has(is, glob, '[:');
  tok.is.globstar = has(is, glob, '**');
  tok.is.dotfile  = index$67(tok.path.basename) || index$67(tok.path.filename);
  tok.is.dotdir   = dotdir(tok.path.dirname);
  return (cache[glob] = tok);
};

/**
 * Returns true if the glob matches dot-directories.
 *
 * @param  {Object} `tok` The tokens object
 * @param  {Object} `path` The path object
 * @return {Object}
 */

function dotdir(base) {
  if (base.indexOf('/.') !== -1) {
    return true;
  }
  if (base.charAt(0) === '.' && base.charAt(1) !== '/') {
    return true;
  }
  return false;
}

/**
 * Returns true if the pattern has the given `ch`aracter(s)
 *
 * @param  {Object} `glob` The glob pattern.
 * @param  {Object} `ch` The character to test for
 * @return {Object}
 */

function has(is, glob, ch) {
  return is && glob.indexOf(ch) !== -1;
}

/**
 * Escape/unescape utils
 */

function escape(str) {
  var re = /\{([^{}]*?)}|\(([^()]*?)\)|\[([^\[\]]*?)\]/g;
  return str.replace(re, function (outter, braces, parens, brackets) {
    var inner = braces || parens || brackets;
    if (!inner) { return outter; }
    return outter.split(inner).join(esc(inner));
  });
}

function esc(str) {
  str = str.split('/').join('__SLASH__');
  str = str.split('.').join('__DOT__');
  return str;
}

function unescape(str) {
  str = str.split('__SLASH__').join('/');
  str = str.split('__DOT__').join('.');
  return str;
}
});

/*!
 * is-primitive <https://github.com/jonschlinkert/is-primitive>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

// see http://jsperf.com/testing-value-is-primitive/7
var index$71 = function isPrimitive(value) {
  return value == null || (typeof value !== 'function' && typeof value !== 'object');
};

var index$73 = function isEqual(a, b) {
  if (!a && !b) { return true; }
  if (!a && b || a && !b) { return false; }

  var numKeysA = 0, numKeysB = 0, key;
  for (key in b) {
    numKeysB++;
    if (!index$71(b[key]) || !a.hasOwnProperty(key) || (a[key] !== b[key])) {
      return false;
    }
  }
  for (key in a) {
    numKeysA++;
  }
  return numKeysA === numKeysB;
};

var basic = {};
var cache$3 = {};

/**
 * Expose `regexCache`
 */

var index$69 = regexCache;

/**
 * Memoize the results of a call to the new RegExp constructor.
 *
 * @param  {Function} fn [description]
 * @param  {String} str [description]
 * @param  {Options} options [description]
 * @param  {Boolean} nocompare [description]
 * @return {RegExp}
 */

function regexCache(fn, str, opts) {
  var key = '_default_', regex, cached;

  if (!str && !opts) {
    if (typeof fn !== 'function') {
      return fn;
    }
    return basic[key] || (basic[key] = fn(str));
  }

  var isString = typeof str === 'string';
  if (isString) {
    if (!opts) {
      return basic[str] || (basic[str] = fn(str));
    }
    key = str;
  } else {
    opts = str;
  }

  cached = cache$3[key];
  if (cached && index$73(cached.opts, opts)) {
    return cached.regex;
  }

  memo(key, opts, (regex = fn(str, opts)));
  return regex;
}

function memo(key, opts, regex) {
  cache$3[key] = {regex: regex, opts: opts};
}

/**
 * Expose `cache`
 */

var cache_1 = cache$3;
var basic_1 = basic;

index$69.cache = cache_1;
index$69.basic = basic_1;

var utils_1 = createCommonjsModule(function (module) {
'use strict';

var win32 = process && process.platform === 'win32';


var utils = module.exports;

/**
 * Module dependencies
 */

utils.diff = index$3;
utils.unique = index$7;
utils.braces = index$9;
utils.brackets = index$39;
utils.extglob = index$43;
utils.isExtglob = index$45;
utils.isGlob = index$47;
utils.typeOf = index$21;
utils.normalize = index$49;
utils.omit = index$53;
utils.parseGlob = index$61;
utils.cache = index$69;

/**
 * Get the filename of a filepath
 *
 * @param {String} `string`
 * @return {String}
 */

utils.filename = function filename(fp) {
  var seg = fp.match(index$1());
  return seg && seg[0];
};

/**
 * Returns a function that returns true if the given
 * pattern is the same as a given `filepath`
 *
 * @param {String} `pattern`
 * @return {Function}
 */

utils.isPath = function isPath(pattern, opts) {
  opts = opts || {};
  return function(fp) {
    var unixified = utils.unixify(fp, opts);
    if(opts.nocase){
      return pattern.toLowerCase() === unixified.toLowerCase();
    }
    return pattern === unixified;
  };
};

/**
 * Returns a function that returns true if the given
 * pattern contains a `filepath`
 *
 * @param {String} `pattern`
 * @return {Function}
 */

utils.hasPath = function hasPath(pattern, opts) {
  return function(fp) {
    return utils.unixify(pattern, opts).indexOf(fp) !== -1;
  };
};

/**
 * Returns a function that returns true if the given
 * pattern matches or contains a `filepath`
 *
 * @param {String} `pattern`
 * @return {Function}
 */

utils.matchPath = function matchPath(pattern, opts) {
  var fn = (opts && opts.contains)
    ? utils.hasPath(pattern, opts)
    : utils.isPath(pattern, opts);
  return fn;
};

/**
 * Returns a function that returns true if the given
 * regex matches the `filename` of a file path.
 *
 * @param {RegExp} `re`
 * @return {Boolean}
 */

utils.hasFilename = function hasFilename(re) {
  return function(fp) {
    var name = utils.filename(fp);
    return name && re.test(name);
  };
};

/**
 * Coerce `val` to an array
 *
 * @param  {*} val
 * @return {Array}
 */

utils.arrayify = function arrayify(val) {
  return !Array.isArray(val)
    ? [val]
    : val;
};

/**
 * Normalize all slashes in a file path or glob pattern to
 * forward slashes.
 */

utils.unixify = function unixify(fp, opts) {
  if (opts && opts.unixify === false) return fp;
  if (opts && opts.unixify === true || win32 || path__default.sep === '\\') {
    return utils.normalize(fp, false);
  }
  if (opts && opts.unescape === true) {
    return fp ? fp.toString().replace(/\\(\w)/g, '$1') : '';
  }
  return fp;
};

/**
 * Escape/unescape utils
 */

utils.escapePath = function escapePath(fp) {
  return fp.replace(/[\\.]/g, '\\$&');
};

utils.unescapeGlob = function unescapeGlob(fp) {
  return fp.replace(/[\\"']/g, '');
};

utils.escapeRe = function escapeRe(str) {
  return str.replace(/[-[\\$*+?.#^\s{}(|)\]]/g, '\\$&');
};

/**
 * Expose `utils`
 */

module.exports = utils;
});

var chars = {};
var unesc;
var temp;

function reverse(object, prepender) {
  return Object.keys(object).reduce(function(reversed, key) {
    var newKey = prepender ? prepender + key : key; // Optionally prepend a string to key.
    reversed[object[key]] = newKey; // Swap key and value.
    return reversed; // Return the result.
  }, {});
}

/**
 * Regex for common characters
 */

chars.escapeRegex = {
  '?': /\?/g,
  '@': /\@/g,
  '!': /\!/g,
  '+': /\+/g,
  '*': /\*/g,
  '(': /\(/g,
  ')': /\)/g,
  '[': /\[/g,
  ']': /\]/g
};

/**
 * Escape characters
 */

chars.ESC = {
  '?': '__UNESC_QMRK__',
  '@': '__UNESC_AMPE__',
  '!': '__UNESC_EXCL__',
  '+': '__UNESC_PLUS__',
  '*': '__UNESC_STAR__',
  ',': '__UNESC_COMMA__',
  '(': '__UNESC_LTPAREN__',
  ')': '__UNESC_RTPAREN__',
  '[': '__UNESC_LTBRACK__',
  ']': '__UNESC_RTBRACK__'
};

/**
 * Unescape characters
 */

chars.UNESC = unesc || (unesc = reverse(chars.ESC, '\\'));

chars.ESC_TEMP = {
  '?': '__TEMP_QMRK__',
  '@': '__TEMP_AMPE__',
  '!': '__TEMP_EXCL__',
  '*': '__TEMP_STAR__',
  '+': '__TEMP_PLUS__',
  ',': '__TEMP_COMMA__',
  '(': '__TEMP_LTPAREN__',
  ')': '__TEMP_RTPAREN__',
  '[': '__TEMP_LTBRACK__',
  ']': '__TEMP_RTBRACK__'
};

chars.TEMP = temp || (temp = reverse(chars.ESC_TEMP));

var chars_1 = chars;

var glob = createCommonjsModule(function (module) {
'use strict';




/**
 * Expose `Glob`
 */

var Glob = module.exports = function Glob(pattern, options) {
  if (!(this instanceof Glob)) {
    return new Glob(pattern, options);
  }
  this.options = options || {};
  this.pattern = pattern;
  this.history = [];
  this.tokens = {};
  this.init(pattern);
};

/**
 * Initialize defaults
 */

Glob.prototype.init = function(pattern) {
  this.orig = pattern;
  this.negated = this.isNegated();
  this.options.track = this.options.track || false;
  this.options.makeRe = true;
};

/**
 * Push a change into `glob.history`. Useful
 * for debugging.
 */

Glob.prototype.track = function(msg) {
  if (this.options.track) {
    this.history.push({msg: msg, pattern: this.pattern});
  }
};

/**
 * Return true if `glob.pattern` was negated
 * with `!`, also remove the `!` from the pattern.
 *
 * @return {Boolean}
 */

Glob.prototype.isNegated = function() {
  if (this.pattern.charCodeAt(0) === 33 /* '!' */) {
    this.pattern = this.pattern.slice(1);
    return true;
  }
  return false;
};

/**
 * Expand braces in the given glob pattern.
 *
 * We only need to use the [braces] lib when
 * patterns are nested.
 */

Glob.prototype.braces = function() {
  if (this.options.nobraces !== true && this.options.nobrace !== true) {
    // naive/fast check for imbalanced characters
    var a = this.pattern.match(/[\{\(\[]/g);
    var b = this.pattern.match(/[\}\)\]]/g);

    // if imbalanced, don't optimize the pattern
    if (a && b && (a.length !== b.length)) {
      this.options.makeRe = false;
    }

    // expand brace patterns and join the resulting array
    var expanded = utils_1.braces(this.pattern, this.options);
    this.pattern = expanded.join('|');
  }
};

/**
 * Expand bracket expressions in `glob.pattern`
 */

Glob.prototype.brackets = function() {
  if (this.options.nobrackets !== true) {
    this.pattern = utils_1.brackets(this.pattern);
  }
};

/**
 * Expand bracket expressions in `glob.pattern`
 */

Glob.prototype.extglob = function() {
  if (this.options.noextglob === true) return;

  if (utils_1.isExtglob(this.pattern)) {
    this.pattern = utils_1.extglob(this.pattern, {escape: true});
  }
};

/**
 * Parse the given pattern
 */

Glob.prototype.parse = function(pattern) {
  this.tokens = utils_1.parseGlob(pattern || this.pattern, true);
  return this.tokens;
};

/**
 * Replace `a` with `b`. Also tracks the change before and
 * after each replacement. This is disabled by default, but
 * can be enabled by setting `options.track` to true.
 *
 * Also, when the pattern is a string, `.split()` is used,
 * because it's much faster than replace.
 *
 * @param  {RegExp|String} `a`
 * @param  {String} `b`
 * @param  {Boolean} `escape` When `true`, escapes `*` and `?` in the replacement.
 * @return {String}
 */

Glob.prototype._replace = function(a, b, escape) {
  this.track('before (find): "' + a + '" (replace with): "' + b + '"');
  if (escape) b = esc(b);
  if (a && b && typeof a === 'string') {
    this.pattern = this.pattern.split(a).join(b);
  } else {
    this.pattern = this.pattern.replace(a, b);
  }
  this.track('after');
};

/**
 * Escape special characters in the given string.
 *
 * @param  {String} `str` Glob pattern
 * @return {String}
 */

Glob.prototype.escape = function(str) {
  this.track('before escape: ');
  var re = /["\\](['"]?[^"'\\]['"]?)/g;

  this.pattern = str.replace(re, function($0, $1) {
    var o = chars_1.ESC;
    var ch = o && o[$1];
    if (ch) {
      return ch;
    }
    if (/[a-z]/i.test($0)) {
      return $0.split('\\').join('');
    }
    return $0;
  });

  this.track('after escape: ');
};

/**
 * Unescape special characters in the given string.
 *
 * @param  {String} `str`
 * @return {String}
 */

Glob.prototype.unescape = function(str) {
  var re = /__([A-Z]+)_([A-Z]+)__/g;
  this.pattern = str.replace(re, function($0, $1) {
    return chars_1[$1][$0];
  });
  this.pattern = unesc(this.pattern);
};

/**
 * Escape/unescape utils
 */

function esc(str) {
  str = str.split('?').join('%~');
  str = str.split('*').join('%%');
  return str;
}

function unesc(str) {
  str = str.split('%~').join('?');
  str = str.split('%%').join('*');
  return str;
}
});

/**
 * Expose `expand`
 */

var expand_1 = expand;

/**
 * Expand a glob pattern to resolve braces and
 * similar patterns before converting to regex.
 *
 * @param  {String|Array} `pattern`
 * @param  {Array} `files`
 * @param  {Options} `opts`
 * @return {Array}
 */

function expand(pattern, options) {
  if (typeof pattern !== 'string') {
    throw new TypeError('micromatch.expand(): argument should be a string.');
  }

  var glob$$1 = new glob(pattern, options || {});
  var opts = glob$$1.options;

  if (!utils_1.isGlob(pattern)) {
    glob$$1.pattern = glob$$1.pattern.replace(/([\/.])/g, '\\$1');
    return glob$$1;
  }

  glob$$1.pattern = glob$$1.pattern.replace(/(\+)(?!\()/g, '\\$1');
  glob$$1.pattern = glob$$1.pattern.split('$').join('\\$');

  if (typeof opts.braces !== 'boolean' && typeof opts.nobraces !== 'boolean') {
    opts.braces = true;
  }

  if (glob$$1.pattern === '.*') {
    return {
      pattern: '\\.' + star,
      tokens: tok,
      options: opts
    };
  }

  if (glob$$1.pattern === '*') {
    return {
      pattern: oneStar(opts.dot),
      tokens: tok,
      options: opts
    };
  }

  // parse the glob pattern into tokens
  glob$$1.parse();
  var tok = glob$$1.tokens;
  tok.is.negated = opts.negated;

  // dotfile handling
  if ((opts.dotfiles === true || tok.is.dotfile) && opts.dot !== false) {
    opts.dotfiles = true;
    opts.dot = true;
  }

  if ((opts.dotdirs === true || tok.is.dotdir) && opts.dot !== false) {
    opts.dotdirs = true;
    opts.dot = true;
  }

  // check for braces with a dotfile pattern
  if (/[{,]\./.test(glob$$1.pattern)) {
    opts.makeRe = false;
    opts.dot = true;
  }

  if (opts.nonegate !== true) {
    opts.negated = glob$$1.negated;
  }

  // if the leading character is a dot or a slash, escape it
  if (glob$$1.pattern.charAt(0) === '.' && glob$$1.pattern.charAt(1) !== '/') {
    glob$$1.pattern = '\\' + glob$$1.pattern;
  }

  /**
   * Extended globs
   */

  // expand braces, e.g `{1..5}`
  glob$$1.track('before braces');
  if (tok.is.braces) {
    glob$$1.braces();
  }
  glob$$1.track('after braces');

  // expand extglobs, e.g `foo/!(a|b)`
  glob$$1.track('before extglob');
  if (tok.is.extglob) {
    glob$$1.extglob();
  }
  glob$$1.track('after extglob');

  // expand brackets, e.g `[[:alpha:]]`
  glob$$1.track('before brackets');
  if (tok.is.brackets) {
    glob$$1.brackets();
  }
  glob$$1.track('after brackets');

  // special patterns
  glob$$1._replace('[!', '[^');
  glob$$1._replace('(?', '(%~');
  glob$$1._replace(/\[\]/, '\\[\\]');
  glob$$1._replace('/[', '/' + (opts.dot ? dotfiles : nodot) + '[', true);
  glob$$1._replace('/?', '/' + (opts.dot ? dotfiles : nodot) + '[^/]', true);
  glob$$1._replace('/.', '/(?=.)\\.', true);

  // windows drives
  glob$$1._replace(/^(\w):([\\\/]+?)/gi, '(?=.)$1:$2', true);

  // negate slashes in exclusion ranges
  if (glob$$1.pattern.indexOf('[^') !== -1) {
    glob$$1.pattern = negateSlash(glob$$1.pattern);
  }

  if (opts.globstar !== false && glob$$1.pattern === '**') {
    glob$$1.pattern = globstar(opts.dot);

  } else {
    glob$$1.pattern = balance(glob$$1.pattern, '[', ']');
    glob$$1.escape(glob$$1.pattern);

    // if the pattern has `**`
    if (tok.is.globstar) {
      glob$$1.pattern = collapse(glob$$1.pattern, '/**');
      glob$$1.pattern = collapse(glob$$1.pattern, '**/');
      glob$$1._replace('/**/', '(?:/' + globstar(opts.dot) + '/|/)', true);
      glob$$1._replace(/\*{2,}/g, '**');

      // 'foo/*'
      glob$$1._replace(/(\w+)\*(?!\/)/g, '$1[^/]*?', true);
      glob$$1._replace(/\*\*\/\*(\w)/g, globstar(opts.dot) + '\\/' + (opts.dot ? dotfiles : nodot) + '[^/]*?$1', true);

      if (opts.dot !== true) {
        glob$$1._replace(/\*\*\/(.)/g, '(?:**\\/|)$1');
      }

      // 'foo/**' or '{**,*}', but not 'foo**'
      if (tok.path.dirname !== '' || /,\*\*|\*\*,/.test(glob$$1.orig)) {
        glob$$1._replace('**', globstar(opts.dot), true);
      }
    }

    // ends with /*
    glob$$1._replace(/\/\*$/, '\\/' + oneStar(opts.dot), true);
    // ends with *, no slashes
    glob$$1._replace(/(?!\/)\*$/, star, true);
    // has 'n*.' (partial wildcard w/ file extension)
    glob$$1._replace(/([^\/]+)\*/, '$1' + oneStar(true), true);
    // has '*'
    glob$$1._replace('*', oneStar(opts.dot), true);
    glob$$1._replace('?.', '?\\.', true);
    glob$$1._replace('?:', '?:', true);

    glob$$1._replace(/\?+/g, function(match) {
      var len = match.length;
      if (len === 1) {
        return qmark;
      }
      return qmark + '{' + len + '}';
    });

    // escape '.abc' => '\\.abc'
    glob$$1._replace(/\.([*\w]+)/g, '\\.$1');
    // fix '[^\\\\/]'
    glob$$1._replace(/\[\^[\\\/]+\]/g, qmark);
    // '///' => '\/'
    glob$$1._replace(/\/+/g, '\\/');
    // '\\\\\\' => '\\'
    glob$$1._replace(/\\{2,}/g, '\\');
  }

  // unescape previously escaped patterns
  glob$$1.unescape(glob$$1.pattern);
  glob$$1._replace('__UNESC_STAR__', '*');

  // escape dots that follow qmarks
  glob$$1._replace('?.', '?\\.');

  // remove unnecessary slashes in character classes
  glob$$1._replace('[^\\/]', qmark);

  if (glob$$1.pattern.length > 1) {
    if (/^[\[?*]/.test(glob$$1.pattern)) {
      // only prepend the string if we don't want to match dotfiles
      glob$$1.pattern = (opts.dot ? dotfiles : nodot) + glob$$1.pattern;
    }
  }

  return glob$$1;
}

/**
 * Collapse repeated character sequences.
 *
 * ```js
 * collapse('a/../../../b', '../');
 * //=> 'a/../b'
 * ```
 *
 * @param  {String} `str`
 * @param  {String} `ch` Character sequence to collapse
 * @return {String}
 */

function collapse(str, ch) {
  var res = str.split(ch);
  var isFirst = res[0] === '';
  var isLast = res[res.length - 1] === '';
  res = res.filter(Boolean);
  if (isFirst) res.unshift('');
  if (isLast) res.push('');
  return res.join(ch);
}

/**
 * Negate slashes in exclusion ranges, per glob spec:
 *
 * ```js
 * negateSlash('[^foo]');
 * //=> '[^\\/foo]'
 * ```
 *
 * @param  {String} `str` glob pattern
 * @return {String}
 */

function negateSlash(str) {
  return str.replace(/\[\^([^\]]*?)\]/g, function(match, inner) {
    if (inner.indexOf('/') === -1) {
      inner = '\\/' + inner;
    }
    return '[^' + inner + ']';
  });
}

/**
 * Escape imbalanced braces/bracket. This is a very
 * basic, naive implementation that only does enough
 * to serve the purpose.
 */

function balance(str, a, b) {
  var aarr = str.split(a);
  var alen = aarr.join('').length;
  var blen = str.split(b).join('').length;

  if (alen !== blen) {
    str = aarr.join('\\' + a);
    return str.split(b).join('\\' + b);
  }
  return str;
}

/**
 * Special patterns to be converted to regex.
 * Heuristics are used to simplify patterns
 * and speed up processing.
 */

/* eslint no-multi-spaces: 0 */
var qmark       = '[^/]';
var star        = qmark + '*?';
var nodot       = '(?!\\.)(?=.)';
var dotfileGlob = '(?:\\/|^)\\.{1,2}($|\\/)';
var dotfiles    = '(?!' + dotfileGlob + ')(?=.)';
var twoStarDot  = '(?:(?!' + dotfileGlob + ').)*?';

/**
 * Create a regex for `*`.
 *
 * If `dot` is true, or the pattern does not begin with
 * a leading star, then return the simpler regex.
 */

function oneStar(dotfile) {
  return dotfile ? '(?!' + dotfileGlob + ')(?=.)' + star : (nodot + star);
}

function globstar(dotfile) {
  if (dotfile) { return twoStarDot; }
  return '(?:(?!(?:\\/|^)\\.).)*?';
}

/**
 * The main function. Pass an array of filepaths,
 * and a string or array of glob patterns
 *
 * @param  {Array|String} `files`
 * @param  {Array|String} `patterns`
 * @param  {Object} `opts`
 * @return {Array} Array of matches
 */

function micromatch(files, patterns, opts) {
  if (!files || !patterns) return [];
  opts = opts || {};

  if (typeof opts.cache === 'undefined') {
    opts.cache = true;
  }

  if (!Array.isArray(patterns)) {
    return match(files, patterns, opts);
  }

  var len = patterns.length, i = 0;
  var omit = [], keep = [];

  while (len--) {
    var glob = patterns[i++];
    if (typeof glob === 'string' && glob.charCodeAt(0) === 33 /* ! */) {
      omit.push.apply(omit, match(files, glob.slice(1), opts));
    } else {
      keep.push.apply(keep, match(files, glob, opts));
    }
  }
  return utils_1.diff(keep, omit);
}

/**
 * Return an array of files that match the given glob pattern.
 *
 * This function is called by the main `micromatch` function If you only
 * need to pass a single pattern you might get very minor speed improvements
 * using this function.
 *
 * @param  {Array} `files`
 * @param  {String} `pattern`
 * @param  {Object} `options`
 * @return {Array}
 */

function match(files, pattern, opts) {
  if (utils_1.typeOf(files) !== 'string' && !Array.isArray(files)) {
    throw new Error(msg('match', 'files', 'a string or array'));
  }

  files = utils_1.arrayify(files);
  opts = opts || {};

  var negate = opts.negate || false;
  var orig = pattern;

  if (typeof pattern === 'string') {
    negate = pattern.charAt(0) === '!';
    if (negate) {
      pattern = pattern.slice(1);
    }

    // we need to remove the character regardless,
    // so the above logic is still needed
    if (opts.nonegate === true) {
      negate = false;
    }
  }

  var _isMatch = matcher(pattern, opts);
  var len = files.length, i = 0;
  var res = [];

  while (i < len) {
    var file = files[i++];
    var fp = utils_1.unixify(file, opts);

    if (!_isMatch(fp)) { continue; }
    res.push(fp);
  }

  if (res.length === 0) {
    if (opts.failglob === true) {
      throw new Error('micromatch.match() found no matches for: "' + orig + '".');
    }

    if (opts.nonull || opts.nullglob) {
      res.push(utils_1.unescapeGlob(orig));
    }
  }

  // if `negate` was defined, diff negated files
  if (negate) { res = utils_1.diff(files, res); }

  // if `ignore` was defined, diff ignored filed
  if (opts.ignore && opts.ignore.length) {
    pattern = opts.ignore;
    opts = utils_1.omit(opts, ['ignore']);
    res = utils_1.diff(res, micromatch(res, pattern, opts));
  }

  if (opts.nodupes) {
    return utils_1.unique(res);
  }
  return res;
}

/**
 * Returns a function that takes a glob pattern or array of glob patterns
 * to be used with `Array#filter()`. (Internally this function generates
 * the matching function using the [matcher] method).
 *
 * ```js
 * var fn = mm.filter('[a-c]');
 * ['a', 'b', 'c', 'd', 'e'].filter(fn);
 * //=> ['a', 'b', 'c']
 * ```
 * @param  {String|Array} `patterns` Can be a glob or array of globs.
 * @param  {Options} `opts` Options to pass to the [matcher] method.
 * @return {Function} Filter function to be passed to `Array#filter()`.
 */

function filter(patterns, opts) {
  if (!Array.isArray(patterns) && typeof patterns !== 'string') {
    throw new TypeError(msg('filter', 'patterns', 'a string or array'));
  }

  patterns = utils_1.arrayify(patterns);
  var len = patterns.length, i = 0;
  var patternMatchers = Array(len);
  while (i < len) {
    patternMatchers[i] = matcher(patterns[i++], opts);
  }

  return function(fp) {
    if (fp == null) return [];
    var len = patternMatchers.length, i = 0;
    var res = true;

    fp = utils_1.unixify(fp, opts);
    while (i < len) {
      var fn = patternMatchers[i++];
      if (!fn(fp)) {
        res = false;
        break;
      }
    }
    return res;
  };
}

/**
 * Returns true if the filepath contains the given
 * pattern. Can also return a function for matching.
 *
 * ```js
 * isMatch('foo.md', '*.md', {});
 * //=> true
 *
 * isMatch('*.md', {})('foo.md')
 * //=> true
 * ```
 * @param  {String} `fp`
 * @param  {String} `pattern`
 * @param  {Object} `opts`
 * @return {Boolean}
 */

function isMatch(fp, pattern, opts) {
  if (typeof fp !== 'string') {
    throw new TypeError(msg('isMatch', 'filepath', 'a string'));
  }

  fp = utils_1.unixify(fp, opts);
  if (utils_1.typeOf(pattern) === 'object') {
    return matcher(fp, pattern);
  }
  return matcher(pattern, opts)(fp);
}

/**
 * Returns true if the filepath matches the
 * given pattern.
 */

function contains(fp, pattern, opts) {
  if (typeof fp !== 'string') {
    throw new TypeError(msg('contains', 'pattern', 'a string'));
  }

  opts = opts || {};
  opts.contains = (pattern !== '');
  fp = utils_1.unixify(fp, opts);

  if (opts.contains && !utils_1.isGlob(pattern)) {
    return fp.indexOf(pattern) !== -1;
  }
  return matcher(pattern, opts)(fp);
}

/**
 * Returns true if a file path matches any of the
 * given patterns.
 *
 * @param  {String} `fp` The filepath to test.
 * @param  {String|Array} `patterns` Glob patterns to use.
 * @param  {Object} `opts` Options to pass to the `matcher()` function.
 * @return {String}
 */

function any(fp, patterns, opts) {
  if (!Array.isArray(patterns) && typeof patterns !== 'string') {
    throw new TypeError(msg('any', 'patterns', 'a string or array'));
  }

  patterns = utils_1.arrayify(patterns);
  var len = patterns.length;

  fp = utils_1.unixify(fp, opts);
  while (len--) {
    var isMatch = matcher(patterns[len], opts);
    if (isMatch(fp)) {
      return true;
    }
  }
  return false;
}

/**
 * Filter the keys of an object with the given `glob` pattern
 * and `options`
 *
 * @param  {Object} `object`
 * @param  {Pattern} `object`
 * @return {Array}
 */

function matchKeys(obj, glob, options) {
  if (utils_1.typeOf(obj) !== 'object') {
    throw new TypeError(msg('matchKeys', 'first argument', 'an object'));
  }

  var fn = matcher(glob, options);
  var res = {};

  for (var key in obj) {
    if (obj.hasOwnProperty(key) && fn(key)) {
      res[key] = obj[key];
    }
  }
  return res;
}

/**
 * Return a function for matching based on the
 * given `pattern` and `options`.
 *
 * @param  {String} `pattern`
 * @param  {Object} `options`
 * @return {Function}
 */

function matcher(pattern, opts) {
  // pattern is a function
  if (typeof pattern === 'function') {
    return pattern;
  }
  // pattern is a regex
  if (pattern instanceof RegExp) {
    return function(fp) {
      return pattern.test(fp);
    };
  }

  if (typeof pattern !== 'string') {
    throw new TypeError(msg('matcher', 'pattern', 'a string, regex, or function'));
  }

  // strings, all the way down...
  pattern = utils_1.unixify(pattern, opts);

  // pattern is a non-glob string
  if (!utils_1.isGlob(pattern)) {
    return utils_1.matchPath(pattern, opts);
  }
  // pattern is a glob string
  var re = makeRe(pattern, opts);

  // `matchBase` is defined
  if (opts && opts.matchBase) {
    return utils_1.hasFilename(re, opts);
  }
  // `matchBase` is not defined
  return function(fp) {
    fp = utils_1.unixify(fp, opts);
    return re.test(fp);
  };
}

/**
 * Create and cache a regular expression for matching
 * file paths.
 *
 * If the leading character in the `glob` is `!`, a negation
 * regex is returned.
 *
 * @param  {String} `glob`
 * @param  {Object} `options`
 * @return {RegExp}
 */

function toRegex(glob, options) {
  // clone options to prevent  mutating the original object
  var opts = Object.create(options || {});
  var flags = opts.flags || '';
  if (opts.nocase && flags.indexOf('i') === -1) {
    flags += 'i';
  }

  var parsed = expand_1(glob, opts);

  // pass in tokens to avoid parsing more than once
  opts.negated = opts.negated || parsed.negated;
  opts.negate = opts.negated;
  glob = wrapGlob(parsed.pattern, opts);
  var re;

  try {
    re = new RegExp(glob, flags);
    return re;
  } catch (err) {
    err.reason = 'micromatch invalid regex: (' + re + ')';
    if (opts.strict) throw new SyntaxError(err);
  }

  // we're only here if a bad pattern was used and the user
  // passed `options.silent`, so match nothing
  return /$^/;
}

/**
 * Create the regex to do the matching. If the leading
 * character in the `glob` is `!` a negation regex is returned.
 *
 * @param {String} `glob`
 * @param {Boolean} `negate`
 */

function wrapGlob(glob, opts) {
  var prefix = (opts && !opts.contains) ? '^' : '';
  var after = (opts && !opts.contains) ? '$' : '';
  glob = ('(?:' + glob + ')' + after);
  if (opts && opts.negate) {
    return prefix + ('(?!^' + glob + ').*$');
  }
  return prefix + glob;
}

/**
 * Create and cache a regular expression for matching file paths.
 * If the leading character in the `glob` is `!`, a negation
 * regex is returned.
 *
 * @param  {String} `glob`
 * @param  {Object} `options`
 * @return {RegExp}
 */

function makeRe(glob, opts) {
  if (utils_1.typeOf(glob) !== 'string') {
    throw new Error(msg('makeRe', 'glob', 'a string'));
  }
  return utils_1.cache(toRegex, glob, opts);
}

/**
 * Make error messages consistent. Follows this format:
 *
 * ```js
 * msg(methodName, argNumber, nativeType);
 * // example:
 * msg('matchKeys', 'first', 'an object');
 * ```
 *
 * @param  {String} `method`
 * @param  {String} `num`
 * @param  {String} `type`
 * @return {String}
 */

function msg(method, what, type) {
  return 'micromatch.' + method + '(): ' + what + ' should be ' + type + '.';
}

/**
 * Public methods
 */

/* eslint no-multi-spaces: 0 */
micromatch.any       = any;
micromatch.braces    = micromatch.braceExpand = utils_1.braces;
micromatch.contains  = contains;
micromatch.expand    = expand_1;
micromatch.filter    = filter;
micromatch.isMatch   = isMatch;
micromatch.makeRe    = makeRe;
micromatch.match     = match;
micromatch.matcher   = matcher;
micromatch.matchKeys = matchKeys;

/**
 * Expose `micromatch`
 */

var index = micromatch;

var extractors = {
	Identifier: function Identifier ( names, param ) {
		names.push( param.name );
	},

	ObjectPattern: function ObjectPattern ( names, param ) {
		param.properties.forEach( function (prop) {
			extractors[ prop.key.type ]( names, prop.key );
		});
	},

	ArrayPattern: function ArrayPattern ( names, param ) {
		param.elements.forEach( function (element) {
			if ( element ) { extractors[ element.type ]( names, element ); }
		});
	},

	RestElement: function RestElement ( names, param ) {
		extractors[ param.argument.type ]( names, param.argument );
	},

	AssignmentPattern: function AssignmentPattern ( names, param ) {
		return extractors[ param.left.type ]( names, param.left );
	}
};

function extractNames ( param ) {
	var names = [];

	extractors[ param.type ]( names, param );
	return names;
}

var Scope = function Scope ( options ) {
	var this$1 = this;

	options = options || {};

	this.parent = options.parent;
	this.isBlockScope = !!options.block;

	this.declarations = Object.create( null );

	if ( options.params ) {
		options.params.forEach( function (param) {
			extractNames( param ).forEach( function (name) {
				this$1.declarations[ name ] = true;
			});
		});
	}
};

Scope.prototype.addDeclaration = function addDeclaration ( node, isBlockDeclaration, isVar ) {
		var this$1 = this;

	if ( !isBlockDeclaration && this.isBlockScope ) {
		// it's a `var` or function node, and this
		// is a block scope, so we need to go up
		this.parent.addDeclaration( node, isBlockDeclaration, isVar );
	} else {
		extractNames( node.id ).forEach( function (name) {
			this$1.declarations[ name ] = true;
		});
	}
};

Scope.prototype.contains = function contains ( name ) {
	return this.declarations[ name ] ||
		       ( this.parent ? this.parent.contains( name ) : false );
};


function ensureArray ( thing ) {
	if ( Array.isArray( thing ) ) { return thing; }
	if ( thing == undefined ) { return []; }
	return [ thing ];
}

function createFilter ( include, exclude ) {
	var getMatcher = function (id) { return ( isRegexp( id ) ? id : { test: index.matcher( path.resolve( id ) ) } ); };
	include = ensureArray( include ).map( getMatcher );
	exclude = ensureArray( exclude ).map( getMatcher );

	return function ( id ) {

		if ( typeof id !== 'string' ) { return false; }
		if ( /\0/.test( id ) ) { return false; }

		id = id.split( path.sep ).join( '/' );

		for ( var i = 0; i < exclude.length; ++i ) {
			var matcher = exclude[i];
			if ( matcher.test( id ) ) { return false; }
		}

		for ( var i$1 = 0; i$1 < include.length; ++i$1 ) {
			var matcher$1 = include[i$1];
			if ( matcher$1.test( id ) ) { return true; }
		}

		return !include.length;
	};
}

function isRegexp ( val ) {
	return val instanceof RegExp;
}

var reservedWords = 'break case class catch const continue debugger default delete do else export extends finally for function if import in instanceof let new return super switch this throw try typeof var void while with yield enum await implements package protected static interface private public'.split( ' ' );
var builtins = 'arguments Infinity NaN undefined null true false eval uneval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Symbol Error EvalError InternalError RangeError ReferenceError SyntaxError TypeError URIError Number Math Date String RegExp Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array Map Set WeakMap WeakSet SIMD ArrayBuffer DataView JSON Promise Generator GeneratorFunction Reflect Proxy Intl'.split( ' ' );

var blacklisted = Object.create( null );
reservedWords.concat( builtins ).forEach( function (word) { return blacklisted[ word ] = true; } );

function extract(txt){

  txt = txt.replace(/import \w+ from "pliny"/g, "");

  var test = /pliny\.\w+/g,
    left = 0,
    outputLeft = "",
    outputRight = "",

    startLib = /\s*\/\/ BEGIN PLINY\s*/,
    startLibMatch = txt.match(startLib),
    endLib = /\s*\/\/ END PLINY\s*/,
    endLibMatch = txt.match(endLib);

  if(startLibMatch && endLibMatch) {

    var startLibLength = startLibMatch[0].length,
      startLibIndex = startLibMatch.index,
      startLibEnd = startLibIndex + startLibLength,
      endLibLength = endLibMatch[0].length,
      endLibStart = endLibMatch.index,
      endLibIndex = endLibStart + endLibLength;

    if(0 <= startLibIndex && startLibIndex <= endLibIndex && endLibIndex < txt.length) {
      txt = txt.substring(0, startLibIndex) + txt.substring(endLibIndex);
    }
  }

  var matches = test.exec(txt),
    stringDelims = ['"', "'", "`"];
  while (matches) {
    var sub = txt.substring(left, matches.index),
      depth = 0,
      inString = false,
      curDelim = null,
      found = false;

    outputLeft += sub;

    for (left = matches.index + matches.length; left < txt.length; ++left) {
      const curChar = txt[left],
        delimIdx = stringDelims.indexOf(curChar),
        stringStarted = !inString && delimIdx > -1,
        stringEnded = inString && curChar === curDelim,
        escaped = left > 0 && txt[left - 1] === "\\";

      if ((stringStarted || stringEnded) && !escaped) {
        inString = !inString;
        if(inString) {
          curDelim = curChar;
        }
        else{
          curDelim = null;
        }
      }

      if (!inString) {
        if (txt[left] === "(") {
          found = true;
          ++depth;
        }
        else if (txt[left] === ")") {
          --depth;
        }
      }
      if (depth === 0 && found) {
        break;
      }
    }
    while (left < txt.length && /[;\) \r\n]/.test(txt[left])) {
      left++;
    }

    outputRight += txt.substring(matches.index, left);
    matches = test.exec(txt);
  }
  outputLeft += txt.substring(left);
  return {
    left: outputLeft,
    right: outputRight
  };
}

// Strip pliny calls out of a source file and deposit them into a separate file.
function carve (source, libFile, docFile, callback) {
  fs.readFile(source, "utf-8", function (err, txt) {
    var output = this.extract(txt);
    this.write(libFile, docFile, output, callback);
  });
}

function write(libFile, outputLeft, docFile, outputRight, callback) {
  if(docFile) {
    if(!outputRight) {
      console.warn("no documentation to write to " + docFile);
    }
    else{
      callback = (function(cb) {
        fs.writeFile(docFile, outputRight, cb);
      }.bind(null, callback));
    }
  }
  fs.writeFile(libFile, outputLeft, callback);
}

function rollupPlugin(options) {
  options = options || {};

  var filter = createFilter( options.include, options.exclude ),
    documentation = "";

  return {
    name: "pliny",

    transform ( code, id ) {
      if (filter(id) && !/package\.json$/.test(id) && code.indexOf("pliny") > -1) {
        var obj = extract(code);
        if(obj.right && obj.right.length > 0) {
          documentation += obj.right;
        }
        return obj.left;
      }
    },

    onwrite(options) {
      var docFile = options.dest.replace(/(\.min)?(\.\w+)$/,  ".doc$2");
      return new Promise(function(resolve$$1, reject) {
        if(!documentation) {
          console.warn("no documentation to write to " + docFile);
          resolve$$1(options.dest);
        }
        else{
          fs.writeFile(docFile, documentation, function(){
            resolve$$1(options.dest);
          });
        }
      });
    }
  };
}

exports.extract = extract;
exports.carve = carve;
exports.write = write;
exports.rollupPlugin = rollupPlugin;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=pliny-extractor.js.map
