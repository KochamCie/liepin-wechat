// pages/liepin/liepin.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logo: 1,
    userInput: 1,
    passInput: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    console.log('form发生了submit事件，携带数据为：', e.detail.formId)
    var data = e.detail.value;
    if("" == data.userLogin || "" == data.userPwd){
      wx.showToast({
        title: '？？？请输入信息，不要搞事谢谢',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var formId = e.detail.formId;
    // wx.showToast({
    //   title: formId,
    //   icon: 'none',
    //   duration: 2000
    // })


    wx.request({
      url: app.globalData.apiHost + '/wechat/liepin/' + wx.getStorageSync('openId') + '/' + formId,
      data: e.detail.value,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.openId == wx.getStorageSync('openId')){
          wx.showToast({
            title: '殴咖了',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '？？？$%^&*(DFGHJK#&^*()_)(*&%^&*(',
            icon: 'none',
            duration: 2000
          })
        }
        console.log(res.data);
      }
    })




  },
  formReset() {
    console.log('form发生了reset事件')
  },
  userLoginFocus(e) {
    console.log('user login input focus!!!!', e)
    this.setData({
      logo: 0,
      userInput: 0
    })
  },
  userLoginBlur(e) {
    console.log('user login input blur!!!!', e)
    this.setData({
      logo: 1,
      userInput: 1
    })
  },
  userPassFocus(e) {
    this.setData({
      logo: 0,
      passInput: 0
    })
  },
  userPassBlur(e) {
    this.setData({
      logo: 1,
      passInput: 1
    })
  }

})