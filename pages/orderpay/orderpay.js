
Page({
  data: {
    passData: {},
  },
  onLoad: function (options) {
    let data = JSON.parse(options.passData)
    this.orderpay(data);
  },
  // 支付订单
  orderpay(data) {
    let that = this;
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: "prepay_id=" + data.packageValue,
      signType: data.signType,
      paySign: data.paySign,
      success(res) {
        let data = res.errMsg.split(":")[1];
        const url = `/pages/webview/index?resourceType=orderpay&passData=${data}`
        return wx.redirectTo({ url });
      },
      fail(res) {
        let data = res.errMsg.split(":")[1];
        const url = `/pages/webview/index?resourceType=orderpay&passData=${data}`
        return wx.redirectTo({ url });
      }
    })
  }
})