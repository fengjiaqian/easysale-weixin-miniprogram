// pages/shareShop/shareShop.js
import { webViewUrl } from '../../config'
let that;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
    data: {
      passData: {},
      systemInfo: app.globalData.systemInfo
    },
    onLoad: function (options) {
      that = this;
      let data = JSON.parse(options.passData)
      this.setData({
        passData: data
      })
      // that.sm();
    },

  onShow(){
    // that.sm();
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
   
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
   
  },

  sm(){
    wx.scanCode({
      success(res) {
        console.log(res, "px")
        let param = {
           status:'',
           par:null
        }
        if (res.errMsg && res.errMsg == "scanCode:ok") {
          let text = res.result;
          let arr = text.split("_");
          if (arr.length == 2 && arr[0] == "ORDER"){
            console.log(arr[1]);
            let orderprintingData = {
              uuid: arr[1],
              code:"200"
            }
            that.returnWebview({ orderprintingData })
          }else{
            let orderprintingData = {
              code: "-2"
            }
            that.returnWebview({ orderprintingData})
          }
        } else {  
          let orderprintingData = {
            code: "-1"
          }
          that.returnWebview({ orderprintingData})
        }
     
      },fail(e){
        console.log(e,"px")
        let orderprintingData = {
          code: "-1"
        }
        that.returnWebview({ orderprintingData })
      }
    })
  },
   returnWebview(res) {
    let data = encodeURIComponent(JSON.stringify(Object.assign(this.data.passData, res)))
     const url = `/pages/webview/index?resourceType=orderprinting&passData=${data}`
    return wx.redirectTo({ url });
  },
})