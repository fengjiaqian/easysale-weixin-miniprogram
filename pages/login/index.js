import { fetchWxCode, loginWithWxCode } from '../../utils/loginPack'
Page({
  data: {

  },
  onLoad: function (options) {
    /**
     * 1.没有token,mobileNo的话，弹框授权，用户手动一键微信登录，写缓存并跳转首页。
     * 2.有token,mobileNo的情况,自动登录(暂时没有登录流程),故直接跳转首页。
     */
    //this._initAuth();
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
    const mobileNo = wx.getStorageSync('mobileNo');
    const token = wx.getStorageSync('token');
    if (mobileNo && token) {
      const url = `/pages/webview/index?mobileNo=${mobileNo}&token=${token}`
      return wx.redirectTo({ url });
    }
    this.showModal();
  },
  _fetchWxCode() {
    this.hideModal();
    // fetchWxCode().then(res => {
    //   this.wxCode = res.code;
    //   this.hideModal();
    // }).catch(err => {
    //   console.log(err);
    // })
  },
  getPhoneNumber(e) {
    const { encryptedData, iv } = e.detail;
    if (!encryptedData) {
      console.log('获取手机号码失败');
      return false;
    }
    const params = {
      encryptedData,
      iv,
      authCode: this.wxCode
    }
    loginWithWxCode(params).then((res) => {
      console.log(res.data);
      if (res.result == "success" && res.data) {
        const { mobileNo, token, userId } = res.data;  //bindSuccess
        wx.setStorageSync('mobileNo', mobileNo);
        wx.setStorageSync('token', token);
        wx.setStorageSync('userId', userId);
        wx.redirectTo({
          url: "/pages/webview/index"
        })
      }
    }).catch(err => {
      //TODO 
      console.log(err);
    })
  },
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo)
    const { nickName, avatarUrl } = e.detail.userInfo;
    wx.setStorageSync('nickName', nickName);
    wx.setStorageSync('avatarUrl', avatarUrl);
    wx.redirectTo({
      url: `/pages/webview/index?nickName=${nickName}&avatarUrl=${avatarUrl}`
    })
  },
  showModal() {
    // 显示遮罩层
    this.setData({
      showModalStatus: true
    })
  },
  hideModal() {
    // 隐藏遮罩层
    this.setData({
      showModalStatus: false
    })
  }

})