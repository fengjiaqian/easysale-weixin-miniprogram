import { fetchWxCode, getWXUserPhone, testLogin } from '../../utils/loginPack'
import { $yjpToast } from '../../components/yjp'
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
    wx.showLoading({
      title: '',
    })
    fetchWxCode().then(res => {
      wx.hideLoading();
      this.wxCode = res.code;
    }).catch(err => {
      wx.hideLoading();
      console.log(err);
    })
  },
  getPhoneNumber(e) {
    const { encryptedData, iv } = e.detail;
    if (!encryptedData) {
      const msg = "微信一键登录失败,请重试"
      $yjpToast.show({ text: msg })
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
        const { mobileNo, token, userType, shopId = "", shopHistoryList = [], userState = 1 } = res.data; //bindSuccess
        // userState （0：认证中 1：已认证 2：未认证）, 如果审核拒绝了就是游客。
        const dealerId = shopId;
        mobileNo && (wx.setStorageSync('mobileNo', mobileNo));
        dealerId && (wx.setStorageSync('dealerId', dealerId));
        const historyDealerId = shopHistoryList.length ? shopHistoryList[0].shopId : '';
        //如果没有dealerId，用分享的shareDealerId, 都没有有则为空
        const willDealerId = this.shareDealerId || dealerId || historyDealerId;
        //当分享的shareDealerId存在时，此时的userType应为3  发版前bug 
        let shareUserType = "";
        if (this.shareDealerId != shopId) {
          shareUserType = this.shareDealerId ? 3 : userType;
        }
        //是否需要引导  
        let needGuidance = 0;
        if (userType == 3 && Number(userState) === 2) {
          needGuidance = 1
        }
        wx.removeStorageSync('shareDealerId');//清楚分享的常驻缓存
        wx.reLaunch({
          url: `/pages/webview/index?mobileNo=${mobileNo}&token=${encodeURIComponent(token)}&userType=${userType}&shareUserType=${shareUserType}&shareDealerId=${willDealerId}&needGuidance=${needGuidance}&userState=${userState}`
        })
      }
    }).catch(err => {
      //TODO 
      console.log(err);
      const msg = "微信一键登录失败,请重试"
      $yjpToast.show({ text: msg })
    })
  },
  //测试登录
  _testLogin(event) {
    const { userType } = event.target.dataset;
    let phone = '15071124354';
    if (userType == 1) {
      phone = '13507140306';
    } else if (userType == 2) {
      phone = '13334562345';
    }
    testLogin({ phone }).then((res) => {
      if (res.result == "success" && res.data) {
        const { mobileNo, token, userType, shopId = "", shopHistoryList = [], userState = 1 } = res.data;//bindSuccess
        const dealerId = shopId;
        mobileNo && (wx.setStorageSync('mobileNo', mobileNo));
        dealerId && (wx.setStorageSync('dealerId', dealerId));
        const historyDealerId = shopHistoryList.length ? shopHistoryList[0].shopId : '';
        //如果没有dealerId，用分享的shareDealerId，都没有有则为空
        const willDealerId = this.shareDealerId || dealerId || historyDealerId;
        //当分享的shareDealerId存在时，此时的userType应为3  发版前bug 
        let shareUserType = "";
        if (this.shareDealerId != shopId) {
          shareUserType = this.shareDealerId ? 3 : userType;
        }
        //是否需要引导  
        let needGuidance = 0;
        if (userType == 3 && Number(userState) === 2) {
          needGuidance = 1
        }
        wx.reLaunch({
          url: `/pages/webview/index?mobileNo=${mobileNo}&token=${encodeURIComponent(token)}&userType=${userType}&shareUserType=${shareUserType}&shareDealerId=${willDealerId}&needGuidance=${needGuidance}&userState=${userState}`
        })
      }
    }).catch(err => {
      //TODO 
      console.log(err);
    })
  }
})
