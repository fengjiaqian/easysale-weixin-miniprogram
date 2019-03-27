// pages/payment/payment.js
let requestUtils = require("../../utils/requestPay.js");
Page({
  data: {},
  onLoad: function(options) { //options来获取vue带过来的参数
    let jumpUrl = decodeURIComponent(options.jumpUrl)
    let requestUrl = decodeURIComponent(options.requestUrl)
    let payObject = decodeURIComponent(options.payObject)
    payObject = JSON.parse(payObject)
    requestUtils.loginSyn()
      .then(res => { //调用登录接口
        payObject.webChatAppletPayInfo.code = res.code; //获取code
        return requestUtils.sendRequest(requestUrl, payObject) //调用后台接获取5个参数和sign
      })
      .then(res => {
        let that = this;
        let dataList = res.data.data;
        wx.requestPayment({ //调用微信服务的支付接口
          'appId': dataList.appId,
          'timeStamp': dataList.timeStamp,
          'nonceStr': dataList.nonceStr,
          'package': dataList.package,
          'signType': dataList.signType,
          'paySign': dataList.paySign,
          'success': function(res) {
            console.log('success');
            //定义小程序页面集合
            let pages = getCurrentPages(); //当前页面 (wxpay page)  
            let currPage = pages[pages.length - 1]; //上一个页面 （index page）  
            let prevPage = pages[pages.length - 2]; //通过page.setData方法使index的webview 重新加载url  
            let finalUrl = that.getFinalUrl(jumpUrl, `true`)
            //小程序拿到支付的结果带到vue组件。
            //失败需要添加原因msg
            prevPage.setData({
              url: finalUrl
            })
          },
          'fail': function(res) {
            console.log(res);
            let pages = getCurrentPages();
            let currPage = pages[pages.length - 1];
            let prevPage = pages[pages.length - 2];
            let finalUrl = that.getFinalUrl(jumpUrl, `false`)
            prevPage.setData({
              url: finalUrl
            })
          },
          'complete': function(res) {
            wx.navigateBack();
          }
        });
      })
      .catch(e => {
        let pages = getCurrentPages();
        let currPage = pages[pages.length - 1];
        let prevPage = pages[pages.length - 2];
        let hasParams = jumpUrl.indexOf(`?`) !== -1
        let finalUrl = this.getFinalUrl(jumpUrl, `false`)
        prevPage.setData({
          url: finalUrl
        })
        wx.navigateBack()
      })
  },
  getFinalUrl(jumpUrl, result) {
    let hasParams = jumpUrl.indexOf(`?`) !== -1
    return hasParams ?
      `${jumpUrl}&payResult=${result}&timeStamp=${Date.parse(new Date())}` :
      `${jumpUrl}?payResult=${result}&timeStamp=${Date.parse(new Date())}`
  }

})