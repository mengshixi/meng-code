var http = require('http.js')
//获取用户在平台的信息
function wxpplogin(code) {
  /*var urlwx = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + appKey + '&js_code=' + code + '&grant_type=authorization_code';*/

  var url1 = 'm=auth&a=wxpplogin';
  /*var data1 = { wxurl: urlwx };*/
  var data1 = { code: code};
  http.getData(url1, data1, 'wxlogin', function (wxlogin) {
    var openid = wxlogin.data.openid;
    var unionid = wxlogin.data.unionid;
    wx.setStorage({
      key: 'wx_openid',
      data: openid
    });
    wx.setStorage({
      key: 'wx_unionid',
      data: unionid
    });
    //wx.showToast({ title: ''+wxlogin.status });
    //return;
    if (wxlogin.status == 100) {
      wx.setStorageSync(
        'wx_nouser',
        100
      );

      var url2 = "m=auth&a=bindopenid";
      var userinfo = wx.getStorageSync('wx_userinfo');
      userinfo = JSON.stringify(userinfo);

      var datax = { swtype: 3, userinfo: userinfo, unionid: unionid, openid: openid, bingtype: 'wechat' }
      http.getData(url2, datax, 'code_info', function (bindcode) {
        //wx.showToast({ title: '' + bindcode.status });
        if (bindcode.status == 1) {
          wx.setStorage({
            key: 'tokenx',
            data: bindcode.data.token,
          });
          wx.setStorage({
            key: 'php_userinfo',
            data: bindcode.data,
          });
          wx.setStorage({
            key: 'wx_nouser',
            data: 200,
          });
        }
        //wx.navigateBack();
      });
    } else {
      wx.setStorageSync(
        'tokenx',
        wxlogin.data.token
      );
      wx.setStorageSync(
        'php_userinfo',
        wxlogin.data
      );

      wx.setStorageSync(
        'wx_nouser',
        200
      );
      //wx.navigateBack();
    }
  });
}
//授权检测方法
function weixinglogin() {
  //判断是否已经登录
  var haslogined = wx.getStorageSync('tokenx');
  var url1 = 'm=member&a=index';
  var parm1 = { token: haslogined };

  http.getData(url1, parm1, 'islogined', function (data2) {
    if (data2.status == 1) {
      //如果已经登录了，就不再执行下面的登录操作
      return;
    } else {
      /*wx.navigateTo({
        url: '/pages/auth/index'
      })*/

      //打开提示页面弹窗
      /*wx.showModal({
        title: '欢迎来到好识汇商城',
        content: '广告标识行业交易推广公共平台',
        showCancel: false,
        confirmText: '允许授权',
        success: function (res) {
          if (res.confirm) {
            //console.log('用户点击确定')
            getlogin();
          }
          else if (res.cancel) {
            console.log('用户点击取消')
            weixinglogin();
          }
        }
      })
      return;*/
    }
  });
}
//读取授权信息
function getlogin() {
  wx.setStorageSync('tokenx', '');
  wx.login({
    success: function (res) {
      if (res.code) {
        var code = res.code
        wx.getSetting({
          //已经获取到授权信息
          success: function (res) {
            //if (res.authSetting['scope.userInfo']) {
            //读取用户信息
            getwxuserinfo(code);
            //}
          }, fail: function () {
            opengetuserinfo(code);
          }
        })
      } else {
        // console.log('获取用户登录态失败！' + res.errMsg)
        weixinglogin();//读取失败，重新返回授权提示，强制授权  
      }
    }
  });
}
//打开用户授权设置界面  再次授权
function opengetuserinfo(code) {
  //没有获取到授权信息
  wx.openSetting({
    success: (res) => {
      //读取用户信息
      getwxuserinfo(code);
    }, fail: () => {
      //读取失败，重新返回授权提示，强制授权
      weixinglogin();
    }
  })
}
//获取用户信息
function getwxuserinfo(code) {
  // 已经授权，可以直接调用 getUserInfo 获取头像昵称
  wx.getUserInfo({
    //withCredentials: true,
    success: function (resx) {
      var userInfo = resx.userInfo;
      var nickName = userInfo.nickName;
      var avatarUrl = userInfo.avatarUrl;
      var gender = userInfo.gender;
      var province = userInfo.province;
      var city = userInfo.city;
      var country = userInfo.country;
      wx.setStorageSync('wx_userinfo', userInfo, );
      wx.setStorageSync('wx_has', 1);
      wxpplogin(code);
      
    }, fail: function () {
      wx.setStorageSync('wx_has', 2);
      //opengetuserinfo(code);//再次授权
      weixinglogin();//重新授权
    }
  })
  
}

//微信改版后强制授权
function getWxUserInfoNew(userinfo) {
  //console.log(userinfo);
  wx.setStorageSync('wx_userinfo', userinfo);
  var token = wx.getStorageSync('tokenx');
  if (token == '') {
    wx.login({
      success: function (res) {
        wxpplogin(res.code);
      }
    });
  }
}

module.exports = {
  weixinglogin: weixinglogin,
  getlogin: getlogin,
  getWxUserInfoNew: getWxUserInfoNew
}  