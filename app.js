//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code; //返回code
        wx.request({
          url: this.globalData.apiHost +'/wechat/openid/' + res.code,
          data: {},
          header: {
            'content-type': 'json'
          },
          success: function (res) {
            if(res.data.errcode){
              wx.showModal({
                title: '提示',
                content: res.data.errmsg,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } else {
                    console.log('用户点击取消')
                  }

                }
              })
            }

            var openid = res.data.openid
            console.log(openid)
            //1.存用户信息到本地存储
            wx.setStorageSync('openId', openid)
            //2.存用户信息到全局变量
            var app = getApp();
            app.globalData.openId = openid
            
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(wx.getStorageSync('openId'))
              if (null != wx.getStorageSync('openId')){
                wx.request({
                  url: this.globalData.apiHost+'/wechat/user/' + wx.getStorageSync('openId'),
                  data: res.userInfo,
                  method: 'POST',
                  header: {
                    'content-type': 'application/json'
                  },
                  success: function (res) {
                    console.log(res.data);
                  }
                })
              }
              
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    openId: null,
    apiHost: 'http://www.beelego.com:8888'
  }
})