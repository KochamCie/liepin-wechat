//app.js
App({
  
  onLaunch: function () {

    //检查是否存在新版本
    wx.getUpdateManager().onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log("是否有新版本：" + res.hasUpdate);
      if (res.hasUpdate) {//如果有新版本

        // 小程序有新版本，会主动触发下载操作（无需开发者触发）
        wx.getUpdateManager().onUpdateReady(function () {//当新版本下载完成，会进行回调
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，单击确定重启应用',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                wx.getUpdateManager().applyUpdate();
              }
            }
          })

        })

        // 小程序有新版本，会主动触发下载操作（无需开发者触发）
        wx.getUpdateManager().onUpdateFailed(function () {//当新版本下载失败，会进行回调
          wx.showModal({
            title: '提示',
            content: '检查到有新版本，但下载失败，请检查网络设置',
            showCancel: false,
          })
        })
      }
    });





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
    apiHost: 'https://www.beelego.com'
    // apiHost: 'http://localhost:8888'
  }
})