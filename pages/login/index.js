import { getWxSetting, fetchWxUserInfo } from '../../utils/loginPack'
Page({
  data: {

  },
  onLoad: function (options) {
    /**
     * 1.没有token,mobileNo的话，弹框授权，用户手动一键微信登录，写缓存并跳转首页。
     * 2.有token,mobileNo的情况,自动登录(暂时没有登录流程),故直接跳转首页。
     */
    /**
     * 1.第一次进入程序，获取userInfo（昵称和头像url），并带入网页，我的界面可以展示。
     *   此时，所有页面均以访客模式浏览，根据页面权限是否进入手机号一键登录，调用wx.login(),并获取手机号，发送给后台，此时带入昵称和头像信息。
     *   后台保存手机号，昵称，头像；并返回前端token+userId+mobileNo。客户端缓存用户信息，处理下一次进入逻辑。
     *   如果客户拒绝，正常游客访问。
     * 2.第二次，判断缓存中用户信息，是否有手机号码，有的话走正常登录逻辑（）。
     *   没有手机号码，是否有用户头像或者userInfo授权，带入头像昵称，以访客形式访问。
     * 
     */
    this._initAuth();
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  _initAuth() {
    //mobileNo  token  userType 
    const mobileNo = wx.getStorageSync('mobileNo');
    const token = wx.getStorageSync('token');
    const userType = wx.getStorageSync('userType');

    const nickName = wx.getStorageSync('nickName');
    const avatarUrl = wx.getStorageSync('avatarUrl');
    //有用户手机缓存  用户身份访问
    if (mobileNo && token && userType) {
      const url = `/pages/webview/index?mobileNo=${mobileNo}&token=${encodeURIComponent(token)}&userType=${userType}`
      return wx.redirectTo({ url });
    }
    //有用户头像缓存  
    if (nickName && avatarUrl) {
      return wx.redirectTo({
        url: `/pages/webview/index?nickName=${nickName}&avatarUrl=${avatarUrl}`
      })
    } else { //没有用户头像缓存,判断是否授权 scope.userInfo
      getWxSetting().then(res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框，自动跳转到首页
          fetchWxUserInfo().then(res => {
            const { nickName, avatarUrl } = res.userInfo;
            wx.setStorageSync('nickName', nickName);
            wx.setStorageSync('avatarUrl', avatarUrl);
            wx.redirectTo({
              url: `/pages/webview/index?nickName=${nickName}&avatarUrl=${avatarUrl}`
            })
          }).catch(err => {
            console.log(err)
            //没有授权的情况  等待用户点击  进去bindGetUserInfo回调。
          })
        }
      })
    }
  },
  //用户点击授权CallBack
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo)
    const { nickName, avatarUrl } = e.detail.userInfo;
    wx.setStorageSync('nickName', nickName);
    wx.setStorageSync('avatarUrl', avatarUrl);
    wx.redirectTo({
      url: `/pages/webview/index?nickName=${nickName}&avatarUrl=${avatarUrl}`
    })
  },
})