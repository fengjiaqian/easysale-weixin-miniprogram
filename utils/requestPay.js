//微信支付的promise方法
function loginSyn() {
  let promisevariable = new Promise(function (resolve, reject) {
    wx.login({
      success: res => {
        resolve(res);
        return;
      },
      fail: res => {
        reject(res);
        return;
      }
    })
  });
  return promisevariable;
}
//默认请求
function sendRequest(url, params) {
  let promisevariable = new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: params,
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      success: function (result) {
        console.log("完成请求")
        var status = result.statusCode;
        if (status != 200) {
          //系统未知异常
          var msg = result.data.error;
          var path = result.data.path;
          wx.showToast({
            title: msg + "\n\r" + path,
            icon: 'loading',
            duration: 1000
          });
          reject(result);
          return;
        }
        resolve(result);
      },
      fail: function (result) {
        console.log("请求失败");
        reject(result);
      }
    });
  });
  return promisevariable;
}
//暴露公共访问接口
module.exports = {
  loginSyn,
  sendRequest
}