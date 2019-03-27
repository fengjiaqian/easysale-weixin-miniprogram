Page({
  data: {
    address: ``,
    jumpUrl: ``,
  },
  onLoad: function(options) {
    this.setData({
      jumpUrl: decodeURIComponent(options.jumpUrl)
    })
  },
  onReady: function(e) {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('myMap');
    this.getCenterLocation()
  },
  onShow() {

  },
  getCenterLocation: function() {
    let that = this;
    wx.getLocation({
      type: 'wgs84', //返回可以用于wx.openLocation的经纬度
      success: function(res) {
        let latitude = res.latitude
        let longitude = res.longitude
        wx.chooseLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28,
          success: function(res) {
            console.log(`选择地址结果`, res.address)
            let pages = getCurrentPages()
            let prePage = pages[pages.length - 2]
            let successUrl = that.data.jumpUrl + `?address=` + encodeURIComponent(`${res.address}`)
            //添加经纬度
            successUrl += `&lat=${res.latitude}`
            successUrl += `&lng=${res.longitude}`
            //两次添加一个地址，不会触发事件，因为url没有改变，所以后面加一个时间戳
            successUrl += `&timeStamp=${Date.parse(new Date())}`
            prePage.setData({
              url: successUrl
            })
          },
          fail: function(res) {},
          complete: function(res) {
            wx.navigateBack({
              delta: 1
            })
          },
        })
      }
    })

  },
})