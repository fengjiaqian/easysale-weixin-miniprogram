// pages/shareShop/shareShop.js
import { webViewUrl } from '../../config'
var myCanvas = null;
Page({

  /**
   * 页面的初始数据
   */
    data: {
      jumpUrl: ``,
      resultData:{},
      canvasWidth:420,
      canvasHeight:320
    },
  onLoad: function (options) {
    var that = this;
      //jumpUrl需要解码,解码完后即为调取扫码的页面完整路径
      let jumpUrl = decodeURIComponent(options.jumpUrl)
      let resultData = decodeURIComponent(options.resultData)
      //console.log('jumpUrl', jumpUrl)
      console.log('resultData', resultData)
      this.setData({
        jumpUrl,
        resultData: JSON.parse(resultData) 
      })
      resultData = this.data.resultData;
      resultData.instruction = resultData.instruction || resultData.description;

      const query = wx.createSelectorQuery()
      query.select('#myCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
            let canvas = res[0].node
            const ctx = canvas.getContext('2d')
            const dpr = wx.getSystemInfoSync().pixelRatio
            canvas.width = res[0].width * dpr
            canvas.height = res[0].height * dpr
            that.canvasWidth=canvas.width
            that.canvasHeight = canvas.height
            ctx.scale(dpr, dpr)
            var img = canvas.createImage()
            img.src = '/images/logo_template.png'
            img.onload = function(){
              ctx.drawImage(img,0,0,(canvas.width - 24) * 2,canvas.height * 4 );
              ctx.font = "40px '字体','字体','微软雅黑','宋体'"
              ctx.textBaseline = 'middle';
              resultData.shopName && ctx.fillText(resultData.shopName,20,40)
              ctx.font = "24px '字体','Verdana'"
              
              resultData.address && ctx.fillText(resultData.address,20,80)
              ctx.font = "24px '字体','Verdana'"
              if (resultData.phone) {
                  const formatPhone = resultData.phone.substr(0,3) + " " + resultData.phone.substr(3,4) + " " + resultData.phone.substr(7)
                  ctx.fillText(formatPhone,20,120)
              }
              ctx.fillStyle='red'
              ctx.font = "26px '字体','字体','微软雅黑','宋体'"
              if (resultData.instruction) {
                  if (resultData.instruction.length > 14) {
                      const des1 = resultData.instruction.substr(0, 14);
                      ctx.fillText(des1, 20,160);
                      let des2 = resultData.instruction.substr(14,28);
                      ctx.fillText(des2, 20, 200);
                      if (resultData.instruction.length > 28) {
                        des2 = resultData.instruction.substr(28, 42);
                        ctx.fillText(des2, 20, 240);
                      }
                      if (resultData.instruction.length > 42) {
                        des2 = resultData.instruction.substr(42, 56);
                        ctx.fillText(des2, 20, 280);
                      }
                  } else {
                      ctx.fillText(resultData.instruction, 20,160);
                  }
              }
            }
            myCanvas = canvas;
      })
  },
  /**
 * 生命周期函数--监听页面初次渲染完成
 */
  onReady: function () {
  var that = this;
       wx.canvasToTempFilePath({
          canvas: myCanvas,
          success: function success(res) {
          wx.saveFile({
            tempFilePath: res.tempFilePath,
            success: function success(res) {
                that.data.resultData.path=res.savedFilePath
            }
          });
          },
          fail:function(res) {
            console.log(res);
          }
        });
    
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.returnWebview()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let resultData = this.data.resultData;
    let shareUrl = "/pages/login/index";
    if (resultData.shopId) {
      shareUrl = `/pages/login/index?dealerId=${resultData.shopId}`
    }
    let shareParam = {
      title: resultData.shopText,
      path: `${shareUrl}`,
      imageUrl: `${resultData.path}`,
    }
    return shareParam;
  },

  returnWebview(res) {
    let jumpUrl = this.data.jumpUrl
    const finalUrl = webViewUrl + `/#/${jumpUrl}`
    let pages = getCurrentPages()
    let prePage = pages[pages.length - 2];
    prePage.setData({
      url: finalUrl
    });
    console.log(finalUrl)
    wx.navigateBack({
      delta: 1
    })
  }
})