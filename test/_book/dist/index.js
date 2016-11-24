'use strict';

require('babel-polyfill');

var _path = require('path');

var _fs = require('fs');

var _markdownToAst = require('markdown-to-ast');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var hasFile = function hasFile(path) {
	return new Promise(function (resolve) {
		(0, _fs.stat)((0, _path.resolve)(process.cwd(), './', path), function (err, data) {
			if (data.isFile()) {
				resolve({
					type: 'file'
				});
			} else if (data.isDirectory()) {
				resolve({
					type: 'dir'
				});
			} else {
				resolve(undefined);
			}
		});
	});
};

var getFielContent = function getFielContent(path) {
	return new Promise(function (resolve) {
		(0, _fs.readFile)((0, _path.resolve)(process.cwd(), './', path), function (err, data) {
			if (err) throw new Error(err);
			resolve(data.toString());
		});
	});
};

var writeFileContent = function writeFileContent(path, content) {
	return new Promise(function (reslove) {
		(0, _fs.writeFile)((0, _path.resolve)(process.cwd(), './', path), content, 'utf8', function (err, data) {
			if (err) throw new Error(err);

			reslove({
				success: true
			});
		});
	});
};

var getFileByArray = function () {
	var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(arr) {
		var result, i, reg, titleReg, contentReg, title, content, data, replaceTitleReg;
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						result = [];
						i = 0;

					case 2:
						if (!(i < arr.length)) {
							_context.next = 21;
							break;
						}

						reg = arr[i];
						titleReg = /(\[.*\])/;
						contentReg = /(\(.*\))/;
						title = void 0;
						content = void 0;


						if (titleReg.test(reg)) {
							title = RegExp.$1 && RegExp.$1.replace(/^\[/, '').replace(/\]$/, '');
						}
						if (contentReg.test(reg)) {
							content = RegExp.$1 && RegExp.$1.replace(/^\(/, '').replace(/\)$/, '');
						}

						if (!(content != 'README.md')) {
							_context.next = 18;
							break;
						}

						_context.next = 13;
						return getFielContent(content);

					case 13:
						data = _context.sent;
						replaceTitleReg = /(\#+\ +)/img;

						data = data.toString();
						data = data.replace(replaceTitleReg, function (str) {
							return '##' + str;
						});
						result.push(title + '\n\n' + data);

					case 18:
						i++;
						_context.next = 2;
						break;

					case 21:
						return _context.abrupt('return', new Promise(function (res) {
							res(result);
						}));

					case 22:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, this);
	}));

	return function getFileByArray(_x) {
		return _ref.apply(this, arguments);
	};
}();

var get = function () {
	var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
		var hasReadMe, hasSummary, summaryContent, summaryStart2TitleReg, URLMatch, fileArray, index, result;
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						_context2.next = 2;
						return hasFile('./README.md');

					case 2:
						hasReadMe = _context2.sent;
						_context2.next = 5;
						return hasFile('./SUMMARY.md');

					case 5:
						hasSummary = _context2.sent;

						if (hasReadMe) {
							_context2.next = 9;
							break;
						}

						throw new Error('current dir do not have README.md');

					case 9:
						if (hasSummary) {
							_context2.next = 12;
							break;
						}

						throw new Error('current dir do not have SUMMARY.md');

					case 12:
						_context2.next = 14;
						return getFielContent('./SUMMARY.md');

					case 14:
						summaryContent = _context2.sent;
						summaryStart2TitleReg = /[^\s]+\ +/img;

						summaryContent = summaryContent.replace(summaryStart2TitleReg, function (str) {
							return '# ';
						});

						URLMatch = /(\[.*\]\(.*\))/img;
						_context2.next = 20;
						return getFileByArray(summaryContent.match(URLMatch));

					case 20:
						fileArray = _context2.sent;
						index = 0;


						summaryContent = summaryContent.replace(URLMatch, function (reg) {
							return fileArray[index++];
						});

						_context2.next = 25;
						return writeFileContent('./README.md', summaryContent);

					case 25:
						result = _context2.sent;

						console.log(result.success ? '回写成功' : '卧槽 失败了');

					case 27:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, this);
	}));

	return function get() {
		return _ref2.apply(this, arguments);
	};
}();

get().then().catch(function (e) {
	return console.log(e);
});