/**
             * 浮点数相加
             * @param {type} arg1
             * @param {type} arg2
             * @returns {Number}
             */
function acc_add(arg1, arg2) {
  var r1, r2, m;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  return (arg1 * m + arg2 * m) / m;
}

/**
 * 保留两位小数
 * @param {type} x
 * @returns {String|float_two_decimal.s_x|Boolean}
 */
function float_two_decimal(x) {
  var f_x = parseFloat(x);
  if (isNaN(f_x)) {
    //alert('function:parameter error');
    return false;
  }
  var f_x = Math.round(x * 100) / 100;
  var s_x = f_x.toString();
  var pos_decimal = s_x.indexOf('.');
  if (pos_decimal < 0) {
    pos_decimal = s_x.length;
    s_x += '.';
  }
  while (s_x.length <= pos_decimal + 2) {
    s_x += '0';
  }
  return s_x;
}

module.exports = {
  acc_add: acc_add,
  float_two_decimal: float_two_decimal
}