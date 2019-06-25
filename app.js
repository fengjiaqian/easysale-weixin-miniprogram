//app.js
var that;
App({
  
  onLaunch: function (options) {
    that=this;
    this.getSystemInfo()
  },
  /**
 *  获取系统信息
 */
  getSystemInfo: function () {
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        if (res.platform) {
          if (res.platform == 'ios') {
            that.globalData.systemInfo.isIos = true;
          } else if (res.platform == 'android') {
            that.globalData.systemInfo.isAndroid = true;
          }
        }
      }
    })
  },
  globalData: {
    systemInfo: {
      // isIphoneX: false,
      isIos: false,
      isAndroid: false,
    },
  }
})