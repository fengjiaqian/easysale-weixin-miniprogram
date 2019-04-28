import {
  getWxSetting,
  fetchWxUserInfo,
  testLogin,
  fetchWxCode,
  getWXOpenId
} from '../../utils/loginPack'
Page({
  data: {

  },
  onLoad: function (options) {
    /**
     * //第一次 openid 
     * init   wx.login()==>code==>后台==>返回(微信weChatToken)          后台知道openid 和 session_key
     * 用户点击==》 个人信息==》  回调个人信息  ==》    前端写入缓存用户信息
     * 进去首页  此时还没有绑定手机 
     * 绑定手机页面==》再获取code + 用户信息 + 回调手机信息 + wxToken==》后台 ==》 返回（mobileNo  业务token  userType  ）   后台知道openid+用户信息解密数据+手机号，映射并返回  
     *  
     * //第二次  
     * 没有手机号码缓存 
     * 微信授权登录 
     *  wx.login()==>code =》    
     * 1).绑定情况下 ：后台知道openid 和 session_key , 直接去匹配用户mobileNo , 匹配到了， 请求success ，bindSuccess==true, 返回前端auth信息；
     *     
     * 2).没绑定情况下：匹配不到，请求success, bindSuccess==false, 返回(微信weChatToken)。
     * 
     * 短时间内 ，前端第二次携带微信weChatToken和手机号，去bind用户，bindSuccess==true,返回前端auth信息。
     * 失败则bindSuccess==false，提示绑定失败。
     * 问题： code只能用一次，不同的code，后台查到的openid一样，返回微信weChatToken不一样。
     */

    /**
     * 1.第一次进入程序，获取userInfo（昵称和头像url），并带入网页，我的界面可以展示。
     *   此时，所有页面均以访客模式浏览，根据页面权限是否进入手机号一键登录，调用wx.login(),并获取手机号，发送给后台，此时带入昵称和头像信息。
     *   后台保存手机号，昵称，头像；并返回前端token+userId+mobileNo。客户端缓存用户信息，处理下一次进入逻辑。
     *   如果客户拒绝，正常游客访问。
     * 2.第二次，判断缓存中用户信息，是否有手机号码，有的话走正常登录逻辑（）。
     *   没有手机号码，是否有用户头像或者userInfo授权，带入头像昵称，以访客形式访问。
     */
    this._fetchWxCode(options);
    var _this = this;
    wx.showModal({
      title: '提示',
      content: '是否清空缓存',
      success(res) {
        if (res.confirm) {
          wx.clearStorageSync();
          // _this._initAuth(options);
        } else if (res.cancel) {
          // _this._initAuth(options);
        }
      }
    })
    //this._initAuth(options);
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  _fetchWxCode(options) {
    //如果是分享进来的 (来自经销商或者销售人员) options.dealerId
    const shareDealerId = options.dealerId || '';
    //处理shareDealerId,在手机号码登录时，再次带入网页，应该长驻缓存
    shareDealerId && (wx.setStorageSync('shareDealerId', shareDealerId));
    fetchWxCode().then(res => {
      const wxCode = res.code;
      getWXOpenId(wxCode).then(res => {
        if (res.result == "success" && res.data) {
          const { weChatToken, bindSuccess } = res.data;
          /*************************** */
          if (bindSuccess) {
            //绑定成功的，直接返回auth信息，不用二次点击手机号，直接进去首页。  
            const { mobileNo,
              token,
              userType,
              dealerId,
              shopHistoryList = []
            } = res.data;
            mobileNo && (wx.setStorageSync('mobileNo', mobileNo));
            dealerId && (wx.setStorageSync('dealerId', dealerId));
            const historyDealerId = shopHistoryList.length ? shopHistoryList[0] : '';
            //如果没有dealerId，用分享的shareDealerId，都没有有则为空
            const willDealerId = dealerId || shareDealerId || historyDealerId;
            wx.reLaunch({
              url: `/pages/webview/index?mobileNo=${mobileNo}&token=${encodeURIComponent(token)}&userType=${userType}&shareDealerId=${willDealerId}`
            })
          } else {
            /*************************** */
            weChatToken && (wx.setStorageSync('weChatToken', weChatToken));
            const nickName = wx.getStorageSync('nickName');
            const avatarUrl = wx.getStorageSync('avatarUrl');
            //有用户头像缓存  
            if (nickName && avatarUrl) {
              return wx.redirectTo({
                url: `/pages/webview/index?nickName=${nickName}&avatarUrl=${avatarUrl}&shareDealerId=${shareDealerId}`
              })
            } else { //没有用户头像缓存,判断是否授权 scope.userInfo
              getWxSetting().then(res => {
                if (res.authSetting['scope.userInfo']) {
                  // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框，自动跳转到首页
                  fetchWxUserInfo().then(res => {
                    const {
                      nickName,
                      avatarUrl
                    } = res.userInfo;
                    wx.setStorageSync('nickName', nickName);
                    wx.setStorageSync('avatarUrl', avatarUrl);
                    wx.redirectTo({
                      url: `/pages/webview/index?nickName=${nickName}&avatarUrl=${avatarUrl}&shareDealerId=${shareDealerId}`
                    })
                  }).catch(err => {
                    console.log(err)
                    //没有授权的情况  等待用户点击  进去bindGetUserInfo回调。
                  })
                }
              })
            }
          }
        }
      })
    }).catch(err => {
      //TODO err处理 
      console.log(err);
    })
  },
  _initAuth(options) {
    //如果是分享进来的 (来自经销商或者销售人员) options.dealerId
    const shareDealerId = options.dealerId || '';
    //处理shareDealerId,在手机号码登录时，再次带入网页，应该长驻缓存
    shareDealerId && (wx.setStorageSync('shareDealerId', shareDealerId));
    //mobileNo  token  userType 
    const mobileNo = wx.getStorageSync('mobileNo');
    const nickName = wx.getStorageSync('nickName');
    const avatarUrl = wx.getStorageSync('avatarUrl');
    // 有用户手机缓存  用户身份访问  还是要走一边登录流程 
    if (mobileNo) {
      testLogin({
        phone: mobileNo
      }).then((res) => {
        console.log(res.data);
        if (res.result == "success" && res.data) {
          const {
            mobileNo,
            token,
            userType,
            dealerId
          } = res.data;
          mobileNo && (wx.setStorageSync('mobileNo', mobileNo));
          dealerId && (wx.setStorageSync('dealerId', dealerId));
          //如果没有dealerId，用分享的shareDealerId，都没有有则为空
          const willDealerId = dealerId || shareDealerId;
          wx.reLaunch({
            url: `/pages/webview/index?mobileNo=${mobileNo}&token=${encodeURIComponent(token)}&userType=${userType}&shareDealerId=${willDealerId}`
          })
        }
      }).catch(err => {
        //TODO 
        console.log(err);
      })
      return true;
    }
    //有用户头像缓存  
    if (nickName && avatarUrl) {
      return wx.redirectTo({
        url: `/pages/webview/index?nickName=${nickName}&avatarUrl=${avatarUrl}&shareDealerId=${shareDealerId}`
      })
    } else { //没有用户头像缓存, 判断是否授权 scope.userInfo
      getWxSetting().then(res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框，自动跳转到首页
          fetchWxUserInfo().then(res => {
            const {
              nickName,
              avatarUrl
            } = res.userInfo;
            wx.setStorageSync('nickName', nickName);
            wx.setStorageSync('avatarUrl', avatarUrl);
            wx.redirectTo({
              url: `/pages/webview/index?nickName=${nickName}&avatarUrl=${avatarUrl}&shareDealerId=${shareDealerId}`
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
    const shareDealerId = wx.getStorageSync('shareDealerId') || '';
    const {
      nickName,
      avatarUrl
    } = e.detail.userInfo;
    wx.setStorageSync('nickName', nickName);
    wx.setStorageSync('avatarUrl', avatarUrl);
    wx.redirectTo({
      url: `/pages/webview/index?nickName=${nickName}&avatarUrl=${avatarUrl}&shareDealerId=${shareDealerId}`
    })
  },
})