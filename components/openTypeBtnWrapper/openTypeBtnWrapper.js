/*
 * author YZS  2018-10-19
 */
const App = getApp()

Component({
    // pageLifetimes:{
    //     show(){
    //         if(App.globalData.queryAreaData){
    //             this.initListDesc();
    //         }
    //     }
    // },
    // properties: {
    //   isFromList: {
    //     type: Boolean,
    //     value: false,
    //   },
    // },
    data: {
        showModalStatus: true,
    },
    methods: {
        //2).页面bind获取用户信息  
        getuserinfo(e) {
            console.log(e)
            //this.hideModal();
            if (!e.detail) {
                //容错
            }
            //3).向后台发送 wxCode  encryptedData  iv; 后台取得用户唯一openid/unionId; 并返回 3rdSessionId 并关联session_key 和 openId.
            const { encryptedData, iv } = e.detail;
            //4).前端缓存3rdSessionId 并 弹出获取手机号码信息;

        },
    }
    // attached: function () {

    // },
    // ready:function(){
    //    this.initListDesc();
    // },
    // methods: {
    //     initListDesc(){
    //         //* 取缓存一些相关的设置
    //         const appSetting = wx.getStorageSync('appSetting') || {};
    //         let desc = appSetting.productListDiscountDesc || '';
    //         let qsMoney = this.getQsMoney()
    //         desc = desc.replace('【金额】', qsMoney);
    //         this.setData({ listDesc: desc })
    //     },
    //     hideCouponDiscountTip() {
    //         this.setData({
    //             listDesc: null
    //         })
    //         this.triggerEvent('reset-scroll-height', {height: 78}) 
    //     },
    // //获取起送金额
    //     getQsMoney(){
    //           let qsMoney = App.globalData.appSetting && App.globalData.appSetting.minBuyAmount || 0
    //           //如果是搜索列表，直接显示城市起送
    //           if (this.data.isFromList){
    //             return qsMoney
    //           }
    //           //如果是从专区进来的，需要判断专区起送金额
    //           let channelList = App.globalData.cartChannelList
    //           let currentAreaId = App.globalData.currentAreaId
    //           if(currentAreaId && channelList) {
    //           let channel = channelList.find(item => item.channelId == currentAreaId)
    //           if (channel && channel.leastBuyAmount > 0) {
    //             qsMoney = channel.leastBuyAmount
    //           }
    //         }
    //         return qsMoney
    //     },
    //     touchS(e) {
    //         if (e.touches.length == 1) {
    //             this.setData({ paused: true })
    //         }
    //     },
    //     touchE(e) {
    //         if (e.changedTouches.length == 1) {
    //             this.setData({ paused: false })
    //         }
    //     },
    // }
})  
