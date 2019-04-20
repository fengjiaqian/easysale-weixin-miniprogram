// const webViewUrl = 'http://192.168.0.211:9999'
const webViewUrl = 'http://easysalemini.test.yijiupidev.com'
Page({
  data: {
    // url: `https://microdealer.yijiupi.com/#/login?redirect=%2F`, //部署正式的环境
    //  url: `http://microdealer.release.yijiupidev.com/#/login?redirect=%2F`, //部署的测试环境
    url: "",
  },
  onLoad: function (options) {
    console.log(options)
    //从定位页面过来回到定位页面去
    if (options.resourceType == 'location') {
      let passData = JSON.parse(options.passData)
      return this.setData({
        url: webViewUrl + `/#${passData.path}?passData=${options.passData}`
      })
    }
    // TODO 
    if (options.nickName) {
      const nickName = encodeURIComponent(options.nickName);
      const avatarUrl = encodeURIComponent(options.avatarUrl);
      this.setData({
        url: webViewUrl + `/#/navi/home?nickName=${nickName}&avatarUrl=${avatarUrl}`
      })
    }
    //
    if (options.token) {
      const { mobileNo, token, userType } = options;
      this.setData({
        url: webViewUrl + `/#/navi/home?mobileNo=${mobileNo}&token=${decodeURIComponent(token)}&userType=${userType}`
      })
    }
  },
  onShow: function () {

  },
  onShareAppMessage() {
    return {
      path: "/pages/login/index"
    }
  },
})