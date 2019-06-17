// pages/shareShop/shareShop.js
import { webViewUrl } from '../../config'
let that = null;
Page({

  /**
   * 页面的初始数据
   */
    data: {
      passData: {},
    },
    onLoad: function (options) {
      that = this;
      let data = JSON.parse(options.passData)
      this.setData({
        passData: data
      })
      that.sm();
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
              uuid: arr[1]
            }
            that.returnWebview({ orderprintingData })
          }else{
            that.returnWebview({})
          }
        } else {  
          that.returnWebview({})
        }
     
      }
    })
  },
   returnWebview(res) {
    let data = encodeURIComponent(JSON.stringify(Object.assign(this.data.passData, res)))
     const url = `/pages/webview/index?resourceType=orderprinting&passData=${data}`
    return wx.redirectTo({ url });
  },
})