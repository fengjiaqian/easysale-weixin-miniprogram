// pages/scon/scon.js
Page({
  data: {
    jumpUrl: ``,
    extraParams: {}
  },
  onLoad: function(options) {
    //jumpUrl需要解码,解码完后即为调取扫码的页面完整路径
    let jumpUrl = decodeURIComponent(options.jumpUrl)
    console.log('jumpUrl', jumpUrl)
    //extraParams:额外参数,为转码后的JSON字符串
    console.log('extraParams', options.extraParams)
    this.setData({
      jumpUrl,
      extraParams: options.extraParams || {}
    })
  },
  onReady: function() {
    let that = this;
    wx.scanCode({
      success: (res) => {
        let scanResult = res.result
        console.log('扫码结果', scanResult)
        let pages = getCurrentPages()
        let prePage = pages[pages.length - 2]
        //先判断jumpUrl是否路径中带了query，比如：url?a=b
        let hasQuery = that.data.jumpUrl.split(`?`).length != 1
        //构造最终跳转的url，以原始页面的url开始，参数拼到后面
        let finalUrl = `${that.data.jumpUrl}`
        //如果有query，则应该拼接&符号而不是?符号
        if (hasQuery) {
          finalUrl += `&scanResult=${scanResult}`
        } else {
          finalUrl += `?scanResult=${scanResult}`
        }
        //判断是否有额外参数需要拼接
        if (that.data.extraParams) {
          finalUrl += `&extraParams=${that.data.extraParams}`
        }
        //两次扫描同一个码，不会触发事件，因为url没有改变，所以后面加一个时间戳
        finalUrl += `&timeStamp=${Date.parse(new Date())}`
        prePage.setData({
          url: finalUrl
        })
      },
      fail: (res) => {

      },
      complete: (res) => {
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})