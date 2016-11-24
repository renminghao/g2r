'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

require('babel-polyfill');

var _path = require('path');

var _fs = require('fs');

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * 检查文件是否存在
 */
var currentMenu = process.cwd();

var hasFile = function hasFile(path) {
	return new Promise(function (resolve) {
		(0, _fs.stat)((0, _path.resolve)(currentMenu, './', path), function (err, data) {
			if (err) {
				resolve(undefined);
			} else if (data.isFile()) {
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
/**
 * 查看文件内容
 */
var getFielContent = function getFielContent(path) {
	return new Promise(function (resolve) {
		(0, _fs.readFile)((0, _path.resolve)(currentMenu, './', path), function (err, data) {
			if (err) throw new Error(err);
			resolve(data.toString());
		});
	});
};
/**
 * 写文件
 */
var writeFileContent = function writeFileContent(path, content) {
	return new Promise(function (reslove) {
		(0, _fs.writeFile)((0, _path.resolve)(currentMenu, './', path), content, 'utf8', function (err, data) {
			if (err) throw new Error(err);

			reslove({
				success: true
			});
		});
	});
};
/**
 * 批量获取文件内容
 */
var getFileByArray = function () {
	var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(arr, gdir) {
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
						return getFielContent((0, _path.resolve)(currentMenu, './', gdir, content));

					case 13:
						data = _context.sent;
						replaceTitleReg = /(\#+\ +)/img;

						data = data.toString();
						data = data.replace(replaceTitleReg, function (str) {
							return '##' + str;
						});

						result.push('<a name="' + content.replace(/\.md$/, '') + '">' + title + '</a>\n\n' + data);

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

	return function getFileByArray(_x, _x2) {
		return _ref.apply(this, arguments);
	};
}();

var get = function () {
	var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(gdir, rdir) {
		var hasReadMe, hasSummary, URLMatch, summaryContent, currentContent, summaryStart2TitleReg, fileArray, index, result;
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						_context2.next = 2;
						return hasFile((0, _path.resolve)(rdir, './README.md'));

					case 2:
						hasReadMe = _context2.sent;
						_context2.next = 5;
						return hasFile((0, _path.resolve)(gdir, './SUMMARY.md'));

					case 5:
						hasSummary = _context2.sent;
						URLMatch = /(\[.*\]\(.*\))/img;


						if (!hasReadMe) {
							console.log('不存在README文件，自动创建中....'.green);
							(0, _fs.writeFile)((0, _path.resolve)(currentMenu, rdir, './README.md'), '', 'utf8');
							console.log('README文件创建成功...'.green);
						}

						if (hasSummary) {
							_context2.next = 11;
							break;
						}

						throw new Error('current dir do not have SUMMARY.md, program will break');

					case 11:
						_context2.next = 13;
						return getFielContent((0, _path.resolve)(gdir, './SUMMARY.md'));

					case 13:
						summaryContent = _context2.sent;
						_context2.next = 16;
						return getFielContent((0, _path.resolve)(gdir, './SUMMARY.md'));

					case 16:
						currentContent = _context2.sent;


						currentContent = currentContent.replace(URLMatch, function (str) {
							str = str.replace(/\.md/, '');
							var temp = str.split(/\]\ *\(/img);
							return temp.join('](#');
						});

						summaryStart2TitleReg = /[^\s]+\ +/img;

						summaryContent = summaryContent.replace(summaryStart2TitleReg, function (str) {
							return '# ';
						});

						_context2.next = 22;
						return getFileByArray(summaryContent.match(URLMatch), gdir);

					case 22:
						fileArray = _context2.sent;
						index = 0;


						summaryContent = summaryContent.replace(URLMatch, function (reg) {
							return fileArray[index++];
						});

						_context2.next = 27;
						return writeFileContent((0, _path.resolve)(currentMenu, './', rdir, './README.md'), currentContent + '\n\n' + summaryContent);

					case 27:
						result = _context2.sent;


						console.log(result.success ? 'gitbook相关内容回写成功'.green : '回写失败，请重试'.red);

					case 29:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, this);
	}));

	return function get(_x3, _x4) {
		return _ref2.apply(this, arguments);
	};
}();

exports.default = get;