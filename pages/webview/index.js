Page({
  data: {
    // url: `https://microdealer.yijiupi.com/#/login?redirect=%2F`, //部署正式的环境
    //  url: `http://microdealer.release.yijiupidev.com/#/login?redirect=%2F`, //部署的测试环境
    url: "",
  },
  onLoad: function (options) {
    console.log(options)
    //TODO 
    if (options.nickName) {
      const nickName = encodeURIComponent(options.nickName);
      const avatarUrl = encodeURIComponent(options.avatarUrl);
      this.setData({
        url: `http://192.168.0.211:9999/#/navi/home?nickName=${nickName}&avatarUrl=${avatarUrl}`
      })
    }
    //
    if (options.token) {
      const { mobileNo, token, userType } = options;
      this.setData({
        url: `http://192.168.0.211:9999/#/navi/home?mobileNo=${mobileNo}&token=${token}&userType=${userType}`
      })
    }
  },
  onShow: function () {

  }
})