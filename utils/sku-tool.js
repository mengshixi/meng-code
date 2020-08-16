/*var startTime = new Date().getTime();
var keys = [['24', '25'], ['12', '13'], ['31', '32']];
var data = { "24;12;31": { price: 366.00, count: 46 }, "25;12;32": { price: 406, count: 66 } }*/

//保存最后的组合结果信息
var SKUResult = {};
//获得对象的key
function getObjKeys(obj) {
  if (obj !== Object(obj)) throw new TypeError('Invalid object');
  var keys = [];
  for (var key in obj)
    if (Object.prototype.hasOwnProperty.call(obj, key))
      keys[keys.length] = key;
  return keys;
}

//把组合的key放入结果集SKUResult
function add2SKUResult(combArrItem, sku) {
  var key = combArrItem.join(";");
  if (SKUResult[key]) {//SKU信息key属性·
    SKUResult[key].count += sku.count;
    SKUResult[key].prices.push(sku.price);
  } else {
    SKUResult[key] = {
      count: sku.count,
      prices: [sku.price]
    };
  }
}

//初始化得到结果集
function initSKU(data) {
  var i, j, skuKeys = getObjKeys(data);
  for (i = 0; i < skuKeys.length; i++) {
    var skuKey = skuKeys[i];//一条SKU信息key
    var sku = data[skuKey];	//一条SKU信息value
    var skuKeyAttrs = skuKey.split(";"); //SKU信息key属性值数组
    skuKeyAttrs.sort(function (value1, value2) {
      return parseInt(value1) - parseInt(value2);
    });

    //对每个SKU信息key属性值进行拆分组合
    var combArr = combInArray(skuKeyAttrs);
    for (j = 0; j < combArr.length; j++) {
      add2SKUResult(combArr[j], sku);
    }

    //结果集接放入SKUResult
    SKUResult[skuKeyAttrs.join(";")] = {
      count: sku.count,
      prices: [sku.price]
    }
  }
}

/**
 * 从数组中生成指定长度的组合
 * 方法: 先生成[0,1...]形式的数组, 然后根据0,1从原数组取元素，得到组合数组
 */
function combInArray(aData) {
  if (!aData || !aData.length) {
    return [];
  }

  var len = aData.length;
  var aResult = [];

  for (var n = 1; n < len; n++) {
    var aaFlags = getCombFlags(len, n);
    while (aaFlags.length) {
      var aFlag = aaFlags.shift();
      var aComb = [];
      for (var i = 0; i < len; i++) {
        aFlag[i] && aComb.push(aData[i]);
      }
      aResult.push(aComb);
    }
  }

  return aResult;
}


/**
 * 得到从 m 元素中取 n 元素的所有组合
 * 结果为[0,1...]形式的数组, 1表示选中，0表示不选
 */
function getCombFlags(m, n) {
  if (!n || n < 1) {
    return [];
  }

  var aResult = [];
  var aFlag = [];
  var bNext = true;
  var i, j, iCnt1;

  for (i = 0; i < m; i++) {
    aFlag[i] = i < n ? 1 : 0;
  }

  aResult.push(aFlag.concat());

  while (bNext) {
    iCnt1 = 0;
    for (i = 0; i < m - 1; i++) {
      if (aFlag[i] == 1 && aFlag[i + 1] == 0) {
        for (j = 0; j < i; j++) {
          aFlag[j] = j < iCnt1 ? 1 : 0;
        }
        aFlag[i] = 0;
        aFlag[i + 1] = 1;
        var aTmp = aFlag.concat();
        aResult.push(aTmp);
        if (aTmp.slice(-n).join("").indexOf('0') == -1) {
          bNext = false;
        }
        break;
      }
      aFlag[i] == 1 && iCnt1++;
    }
  }
  return aResult;
} 

module.exports = {
  getRequestUrl: "http://bocai.com",//获得接口地址
  SKUResult: SKUResult,
  getObjKeys: getObjKeys,
  add2SKUResult: add2SKUResult,
  initSKU: initSKU,
  combInArray: combInArray,
  getCombFlags: getCombFlags
}