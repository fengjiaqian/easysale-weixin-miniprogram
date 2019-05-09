// pages/shareShop/shareShop.js
import { webViewUrl } from '../../config'
Page({

  /**
   * 页面的初始数据
   */
    data: {
      jumpUrl: ``,
      resultData:{}
    },
    onLoad: function (options) {
      //jumpUrl需要解码,解码完后即为调取扫码的页面完整路径
      let jumpUrl = decodeURIComponent(options.jumpUrl)
      let resultData = decodeURIComponent(options.resultData)
      console.log('jumpUrl', jumpUrl)
      console.log('resultData', resultData)
      this.setData({
        jumpUrl,
        resultData: JSON.parse(resultData) 
      })
    },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.returnWebview()
  },

  

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let resultData = this.data.resultData;
    let shareUrl = "/pages/login/index";
    if (resultData.shopId) {
      shareUrl = `/pages/login/index?dealerId=${resultData.shopId}`
    }
    let shareParam = {
      title: resultData.shopText,
      path: `${shareUrl}`,
      imageUrl: `${resultData.path}`,
    }
    return shareParam;
  },

  
  returnWebview(res) {
    let jumpUrl = this.data.jumpUrl
    const finalUrl = webViewUrl + `/#/${jumpUrl}`
    let pages = getCurrentPages()
    let prePage = pages[pages.length - 2];
    prePage.setData({
      url: finalUrl
    });
    console.log(finalUrl)
    wx.navigateBack({
      delta: 1
    })
  },

  
})