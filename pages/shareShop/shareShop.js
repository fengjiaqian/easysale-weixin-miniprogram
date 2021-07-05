// pages/shareShop/shareShop.js
import { webViewUrl } from '../../config'
var myCanvas = null;
/**
 * 截取字符串(通过substring实现并支持中英文混合)
 * @param str
 * @param n 需要截取的长度
 * @returns {*}
 */
function subStrCn(str,startNum,endNum){
  let r = /[^\x00-\xff]/g;
  if(str.replace(r,"**").length<=endNum){return str;}
  let m = Math.floor(endNum/2);
  for(let i=m; i<str.length; i++){
    if(str.substr(startNum,i).replace(r,"**").length>=endNum){
      return str.substr(startNum,endNum);
    }
  }
  return str;
}
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
      //console.log('resultData', resultData)
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
              ctx.font = "19px '字体','字体','微软雅黑','宋体'"
              if (resultData.instruction) {
                  if (resultData.instruction.length > 20) {
                      const des1 = subStrCn(resultData.instruction,0,20);
                      ctx.fillText(des1, 20,160);
                      let des2 = subStrCn(resultData.instruction,20,20);
                      ctx.fillText(des2, 20, 200);
                      if (resultData.instruction.length > 40) {
                        des2 = subStrCn(resultData.instruction,40,20);
                        ctx.fillText(des2, 20, 240);
                      }
                      if (resultData.instruction.length > 60) {
                        des2 = subStrCn(resultData.instruction,60,20);
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
  //延迟缓存图片避免画布还没生成
    setTimeout(() => {
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
    }, 1000)
    
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
    if (!this.data.resultData.path) {
      return false;
    }
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
    //console.log(finalUrl)
    wx.navigateBack({
      delta: 1
    })
  }
})