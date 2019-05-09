import { fetchWxCode, loginWithWxCode, getWXUserPhone, testLogin } from '../../utils/loginPack'

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
    const weChatToken = wx.getStorageSync('weChatToken') || '';
    const params = {
      weChatToken,
      encryptedData,
      iv,
      authCode: this.wxCode,
      nickName,
      avatarUrl
    }
    //多给 nickName avatarUrl
    getWXUserPhone(params).then((res) => {
      console.log(res);
      if (res.result == "success" && res.data) {
        const { bindSuccess, mobileNo, token, userType, shopId = "", shopHistoryList = [] } = res.data;    //bindSuccess
        //
        const dealerId = shopId;
        mobileNo && (wx.setStorageSync('mobileNo', mobileNo));
        dealerId && (wx.setStorageSync('dealerId', dealerId));
        const historyDealerId = shopHistoryList.length ? shopHistoryList[0].shopId : '';
        //如果没有dealerId，用分享的shareDealerId, 都没有有则为空
        const willDealerId = this.shareDealerId || dealerId || historyDealerId;
        //当分享的shareDealerId存在时，此时的userType应为3  发版前bug 
        const shareUserType = shareDealerId ? 3 : userType;
        wx.reLaunch({
          url: `/pages/webview/index?mobileNo=${mobileNo}&token=${encodeURIComponent(token)}&userType=${userType}&shareUserType=${shareUserType}&shareDealerId=${willDealerId}`
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
    let phone = '15500000003';
    if (userType == 1) {
      phone = '13871067026';
    } else if (userType == 2) {
      phone = '13334562345';
    }
    testLogin({ phone }).then((res) => {
      if (res.result == "success" && res.data) {
        const { mobileNo, token, userType, shopId = "", shopHistoryList = [] } = res.data;//bindSuccess
        const dealerId = shopId;
        mobileNo && (wx.setStorageSync('mobileNo', mobileNo));
        dealerId && (wx.setStorageSync('dealerId', dealerId));
        const historyDealerId = shopHistoryList.length ? shopHistoryList[0].shopId : '';
        //如果没有dealerId，用分享的shareDealerId，都没有有则为空
        const willDealerId = this.shareDealerId || dealerId || historyDealerId;
        //当分享的shareDealerId存在时，此时的userType应为3  发版前bug 
        const shareUserType = shareDealerId ? 3 : userType;
        wx.reLaunch({
          url: `/pages/webview/index?mobileNo=${mobileNo}&token=${encodeURIComponent(token)}&userType=${userType}&shareUserType=${shareUserType}&shareDealerId=${willDealerId}`
        })
      }
    }).catch(err => {
      //TODO 
      console.log(err);
    })
  }
})
