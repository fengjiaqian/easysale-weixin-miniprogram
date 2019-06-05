import {webViewUrl} from '../../config'

Page({
    data: {
        // url: `https://microdealer.yijiupi.com/#/login?redirect=%2F`, //部署正式的环境
        //  url: `http://microdealer.release.yijiupidev.com/#/login?redirect=%2F`, //部署的测试环境
        url: "",
    },
    onLoad: function (options) {
        console.log("<><><><><><><><><><><><>"+JSON.stringify(options));
        //从定位页面过来回到定位页面去
        if (options.resourceType == 'location') {
            let passData = JSON.parse(decodeURIComponent(options.passData))
            return this.setData({
                url: webViewUrl + `/#${passData.path}?passData=${options.passData}`
            })
        }
        if (options.mobileNo) {
          const { mobileNo, token, userType, shareDealerId, shareUserType = "", needGuidance = 0, userState = 1, routeRequireGuidance = 0, permissionState} = options;
            let routePath = Number(needGuidance) ? '/identity' : '/navi/home';
            //routeRequireGuidance==1时，先进home页面，再拦截引导guidance
            if (Number(routeRequireGuidance)) {
                routePath = '/navi/home';
            }
            return this.setData({
              url: webViewUrl + `/#${routePath}?mobileNo=${mobileNo}&token=${decodeURIComponent(token)}&userType=${userType}&shareUserType=${shareUserType}&shareDealerId=${shareDealerId}&userState=${userState}&routeRequireGuidance=${routeRequireGuidance}&permissionState=${permissionState}`
            })
        } else if (options.nickName) {
          
            const nickName = decodeURIComponent(options.nickName);
            const avatarUrl = decodeURIComponent(options.avatarUrl);
        
            const shareDealerId = options.shareDealerId || '';
            const token = options.token || '';
            this.setData({
              url: webViewUrl + `/#/navi/home?nickName=${encodeURIComponent(nickName)}&avatarUrl=${encodeURIComponent(avatarUrl)}&token=${decodeURIComponent(token)}&shareDealerId=${shareDealerId}`
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