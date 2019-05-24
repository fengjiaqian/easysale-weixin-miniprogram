import {
    getWxSetting,
    fetchWxUserInfo,
    fetchWxCode,
    getWXOpenId
} from '../../utils/loginPack'

Page({
    data: {},
    onLoad: function (options) {
        /**
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
        wx.showLoading({
            title: '加载中',
            mask: true,
        })
        this._fetchWxCode(options);
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
        /**
         * 2019/05/06 需求变更后  原有的dealerId不代表店铺id了 改为shopId
         * 代码改动  只新增变量  含义不明确。
         */
            //如果是分享进来的 (来自经销商或者销售人员) options.dealerId
        const shareDealerId = options.dealerId || '';
        //处理shareDealerId,在手机号码登录时，再次带入网页，应该长驻缓存
        shareDealerId && (wx.setStorageSync('shareDealerId', shareDealerId));
        fetchWxCode().then(res => {
            const wxCode = res.code;
            getWXOpenId(wxCode).then(res => {
                wx.hideLoading();
                const {token} = res.data;
                token && wx.setStorageSync('token', token);
                if (res.result == "success" && res.data) {
                    const {weChatToken, bindSuccess} = res.data;
                    /*************************** */
                    if (bindSuccess) {
                        //绑定成功的，直接返回auth信息，不用二次点击手机号，直接进去首页。
                        const {
                            mobileNo,
                            userType,
                            shopId = "",
                            shopList = [],
                            shopHistoryList = [],
                            userState = 1
                        } = res.data;
                        //userState （0：认证中 1：已认证 2：未认证）, 如果审核拒绝了就是游客。
                        let dealerId = shopId;
                        mobileNo && (wx.setStorageSync('mobileNo', mobileNo));
                        dealerId && (wx.setStorageSync('dealerId', dealerId));
                        const historyDealerId = shopHistoryList.length ? shopHistoryList[0].shopId : '';
                        //如果没有dealerId，用分享的shareDealerId，都没有有则为空
                        const willDealerId = shareDealerId || dealerId || historyDealerId;
                        //当分享的shareDealerId存在时，此时的userType应为3  发版前bug
                        let shareUserType = "";
                        if (shareDealerId) {
                            const shareShop = shopList.find(shop => shop.shopId == shareDealerId)
                            if (!shareShop) {
                                shareUserType = 3;
                            } else {
                                shareUserType = shareShop.userType;
                            }

                        }
                        //是否需要引导
                        //第二次登录，如果还需要引导，说明用户第一次拒绝引导。
                        //需求：用户在引导页没有完成注册，选择退出后，下次登录也能够直接进入店铺首页，在下单、开店、点击“我的”时候再次出现引导页（目前是未完成注册，登录就直接跳到引导页了）
                        let needGuidance = 0, routeRequireGuidance = 0;
                        if (userType == 3 && Number(userState) === 2) {
                            needGuidance = 1;
                            routeRequireGuidance = 1; //网页多出一个判断
                        }
                        wx.reLaunch({
                            url: `/pages/webview/index?mobileNo=${mobileNo}&token=${encodeURIComponent(token)}&userType=${userType}&shareUserType=${shareUserType}&shareDealerId=${willDealerId}&needGuidance=${needGuidance}&routeRequireGuidance=${routeRequireGuidance}&userState=${userState}`
                        })
                    } else {
                        /*************************** */
                        weChatToken && (wx.setStorageSync('weChatToken', weChatToken));
                        const nickName = wx.getStorageSync('nickName');
                        const avatarUrl = wx.getStorageSync('avatarUrl');
                        //有用户头像缓存
                        if (nickName && avatarUrl) {
                            return wx.redirectTo({
                                url: `/pages/webview/index?nickName=${nickName}&avatarUrl=${avatarUrl}&token=${encodeURIComponent(token)}&shareDealerId=${shareDealerId}`
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
                                            url: `/pages/webview/index?nickName=${nickName}&avatarUrl=${avatarUrl}&token=${encodeURIComponent(token)}&shareDealerId=${shareDealerId}`
                                        })
                                    }).catch(err => {
                                        console.log(err)
                                        //没有授权的情况   等待用户点击   进去bindGetUserInfo回调。
                                    })
                                }
                            })
                        }
                    }
                }
            }).catch(err => {
                wx.hideLoading();
            })
        }).catch(err => {
            wx.hideLoading();
            //TODO err处理
            console.log(err);
        })
    },
    //用户点击授权CallBack
    bindGetUserInfo(e) {
        console.log(e.detail.userInfo)
        const shareDealerId = wx.getStorageSync('shareDealerId') || '';
        const token = wx.getStorageSync('token') || ''
        const {
            nickName,
            avatarUrl
        } = e.detail.userInfo;
        wx.setStorageSync('nickName', nickName);
        wx.setStorageSync('avatarUrl', avatarUrl);
        wx.redirectTo({
            url: `/pages/webview/index?nickName=${nickName}&avatarUrl=${avatarUrl}&token=${encodeURIComponent(token)}&shareDealerId=${shareDealerId}`
        })
    },
})
