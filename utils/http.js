var utilMd5 = require('md5.js');
const weburl = 'https://www.hsh58.com/app/index.php?';
const rooturl = 'https://www.hsh58.com/';
const webserkey = '9192eb0bb73203255f0fa9a228039684';
const webappstr = 'HSh666!@#';
const webapptype = 'weixinapp';
const webversion = '1.0';
	//闭合函数
  // 请求AJAX数据   url 请求数据 缓存名字  方法
function getData(url, data, storagename ='apiretdata',cb) {
  var that = this;
	var url1 = weburl + url;//请求地址
  var time=0;
	var time = Date.parse(new Date());
	time = time / 1000;
  //登录时候必须 storagename='getcaptalogintime',并在data里面传入时间参数time
  if (storagename != 'getcaptalogintime') {
	  time = Date.parse(new Date());
	  time = time / 1000;
	}else{
    time = data.time;
  }
	//console.log(time);
	var key = webserkey + time + webappstr;

	for (let i = 0; i < 3; i++) {
	  key = utilMd5.hexMD5(key);
	};
	var conf2 = { serkey: key, time: time, apptype: webapptype, version: webversion };
	conf2 = Object.assign(conf2, data);
	//console.log(url1);
    wx.request({
      url: url1,
      data: conf2,
      header: {
         //"Content-Type": "application/json"
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      dataType: 'json',
      success: function (res) {
        var msg = res.data;
		//console.log(msg);
		// 登录超时 10001
        if (res.status == 10001 || res.status == 10002) {
          //that.weixinglogin(that);
        }
		return typeof cb == "function" && cb(msg)  
      },
      fail: function () {/*这个是PHP没有收到回传值或者没有执行成功的错误提示*/
        wx.showToast({
          title: '网络错误!',
          icon: 'loading',
          duration: 1500
        })
      },//请求失败
      complete: function () { //console.log('finish');
	  }//请求完成后执行的函数
    });
}
function getUpload(url, filePath, name, data, storagename = 'apiuptdata', cb){
  var that = this;
  var url1 = weburl + url;
  var time = Date.parse(new Date());
  time = time / 1000;

  var key = webserkey + time + webappstr;

  for (let i = 0; i < 3; i++) {
    key = utilMd5.hexMD5(key);
  };
  var conf2 = { serkey: key, time: time, apptype: webapptype, version: webversion };
  conf2 = Object.assign(conf2, data);

  wx.uploadFile({
    url: url1,
    filePath: filePath,
    name: name,
    formData: conf2,
    header: { "Content-Type": "multipart/form-data" },
    method: 'POST',
    success: function (res) {
      var msg = res.data;
      return typeof cb == "function" && cb(msg)  
    },
    fail: function (res) {
      console.log(res);

      wx.showToast({
        title: '网络错误!',
        icon: 'loading',
        duration: 1500
      })
    }
  })
}
function getjson(url, data, cb){
  var that = this;
  var url1 = weburl + url;//请求地址
  var time = Date.parse(new Date());
  time = time / 1000;
	/*if (time == '') {
	  time = Date.parse(new Date());
	  time = time / 1000;
	}*/
  //console.log(time);
  var key = webserkey + time + webappstr;

  for (let i = 0; i < 3; i++) {
    key = utilMd5.hexMD5(key);
  };
  var conf2 = { serkey: key, time: time, apptype: webapptype, version: webversion };
  conf2 = Object.assign(conf2, data);
  return typeof cb == "function" && cb(url1, conf2);  
}
  module.exports = {  
      getUpload: getUpload,
      getData: getData,
      getjson:getjson,
      rooturl: rooturl  
    }  