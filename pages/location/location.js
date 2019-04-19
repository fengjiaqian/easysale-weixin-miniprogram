import { getWxSetting, getWxLocation } from '../../utils/loginPack'
import { $yjpDialog } from '../../components/yjp'
let QQMapWX = require('./../../plugins/wxSDK/qqmap-wx-jssdk.min.js')
import { TencentMapKey } from '../../config'

var qqmapsdk;

Page({
  data: {
    passData: {},
  },
  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      key: TencentMapKey
    });

    let data = JSON.parse(options.passData)
    this.setData({
      passData: data
    })
    this.choose()
  },
  onReady: function () {


  },
  onShow: function (options) {
    
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  // 选择地址
  choose() {
    let that = this;
    getWxSetting()
      .then(data => {
        //没有授权则弹框请求授权
        if (!data.authSetting[`scope.userLocation`]) {
          return wx.authorize({ scope: `scope.userLocation` })
            .catch(e => {
              $yjpDialog.open({
                dialogType: `defaultText`,
                dialogData: { text: `获取定位权限失败，请点击右上角省略号图标->关于->右上角设置，打开定位权限` },
                title: `温馨提示`,
                onCancel() {},
                cancelText: `手动选择`,
                confirmText: `去设置`,
                onConfirm: () => wx.openSetting()
              })
              return Promise.reject(``)
            })
        }
      })
      .then(data =>
        getWxLocation().catch(e => Promise.reject(`未选择地址`))
      )
      .then(data => {
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: data.latitude,
            longitude: data.longitude
          },
          success: (res) => {
            console.log('成功',res)
            let addressData = {
              address: res.result.address,
              longitude: data.latitude,
              latitude: data.longitude
            }
            this.returnWebview({addressData})
          },
          fail: (res) => {
            console.log('失败', res)
            this.returnWebview({ addressData: res.result })
          },
          complete: (res) => {
            
          }
        })
      })
  },
  returnWebview(res){
    let data = decodeURIComponent(JSON.stringify(Object.assign(this.data.passData,res)))
    const url = `/pages/webview/index?resourceType=location&passData=${data}`
    return wx.redirectTo({ url });
  },
})