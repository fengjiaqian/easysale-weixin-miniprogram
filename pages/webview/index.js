import { webViewUrl } from '../../config'
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
      let passData = JSON.parse(decodeURIComponent(options.passData))
      return this.setData({
        url: webViewUrl + `/#${passData.path}?passData=${options.passData}`
      })
    }
    if (options.token) {
      const { mobileNo, token, userType, shareDealerId, shareUserType = "", needGuidance = false } = options;
      // const routePath = needGuidance ? '/identity' : '/navi/home';
      const routePath = '/navi/home';
      return this.setData({
        url: webViewUrl + `/#${routePath}?mobileNo=${mobileNo}&token=${decodeURIComponent(token)}&userType=${userType}&shareUserType=${shareUserType}&shareDealerId=${shareDealerId}`
      })
    }
    // TODO 
    if (options.nickName) {
      const nickName = encodeURIComponent(options.nickName);
      const avatarUrl = encodeURIComponent(options.avatarUrl);
      const shareDealerId = options.shareDealerId || ''
      this.setData({
        url: webViewUrl + `/#/navi/home?nickName=${nickName}&avatarUrl=${avatarUrl}&shareDealerId=${shareDealerId}`
      })
    }
  },
  onShow: function () {

  },
  //分享回调 
  onShareAppMessage() {
    //todo 如果是经销商分享  带上dealerId   
    const dealerId = wx.getStorageSync('dealerId');
    let shareUrl = "/pages/login/index";
    if (dealerId) {
      shareUrl = `/pages/login/index?dealerId=${dealerId}`
    }
    return {
      path: shareUrl
    }
  },
})