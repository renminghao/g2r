'use strict';

var _g2r = require('./g2r');

var _g2r2 = _interopRequireDefault(_g2r);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var gdir = './';
var rdir = './';

(0, _g2r2.default)(gdir, rdir).then().catch(function (e) {
  return console.log(e);
});