import { fetchWxCode, loginWithWxCode, testLogin } from '../../utils/loginPack'

Page({
  data: {

  },
  onLoad: function (options) {
    this.shareDealerId = wx.getStorageSync('shareDealerId') || '';
    this._fetchWxCode();
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  _fetchWxCode() {
    fetchWxCode().then(res => {
      this.wxCode = res.code;
    }).catch(err => {
      console.log(err);
    })
  },
  getPhoneNumber(e) {
    const { encryptedData, iv } = e.detail;
    if (!encryptedData) {
      console.log('获取手机号码失败')
      return false;
    }
    const nickName = wx.getStorageSync('nickName');
    const avatarUrl = wx.getStorageSync('avatarUrl');
    const params = {
      encryptedData,
      iv,
      authCode: this.wxCode,
      nickName,
      avatarUrl
    }
    //多给 nickName avatarUrl
    loginWithWxCode(params).then((res) => {
      console.log(res.data);
      if (res.result == "success" && res.data) {
        const { mobileNo, token, userType, dealerId } = res.data;    //bindSuccess
        mobileNo && (wx.setStorageSync('mobileNo', mobileNo));
        dealerId && (wx.setStorageSync('dealerId', dealerId));
        //如果没有dealerId，用分享的shareDealerId, 都没有有则为空
        const willDealerId = dealerId || this.shareDealerId
        wx.redirectTo({
          url: `/pages/webview/index?mobileNo=${mobileNo}&token=${encodeURIComponent(token)}&userType=${userType}&shareDealerId=${willDealerId}`
        })
      }
    }).catch(err => {
      //TODO 
      console.log(err);
    })
  },
  //测试登录
  _testLogin(event) {
    const { userType } = event.target.dataset;
    console.log(userType);
    let phone = '15500000002';
    if (userType == 1) {
      phone = '15071124354';
    } else if (userType == 2) {
      phone = '13422058968';
    }
    testLogin({ phone }).then((res) => {
      console.log(res.data);
      if (res.result == "success" && res.data) {
        const { mobileNo, token, userType, dealerId } = res.data;//bindSuccess
        mobileNo && (wx.setStorageSync('mobileNo', mobileNo));
        dealerId && (wx.setStorageSync('dealerId', dealerId));
        //如果没有dealerId，用分享的shareDealerId，都没有有则为空
        const willDealerId = dealerId || this.shareDealerId
        wx.redirectTo({
          url: `/pages/webview/index?mobileNo=${mobileNo}&token=${encodeURIComponent(token)}&userType=${userType}&shareDealerId=${willDealerId}`
        })
      }
    }).catch(err => {
      //TODO 
      console.log(err);
    })
  }

})