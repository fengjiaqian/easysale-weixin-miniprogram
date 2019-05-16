/**
 * created by yuanzishu 2019/04/08
 * 二次封装微信登录相关api  返回promise
 */
import { _apiUrl } from '../config'

const $ajax = function (url, method, data) {
  url = _apiUrl + url;
  const header = {
    'chartset': 'utf-8',
    'content-type': 'application/json',
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      method,
      data,
      header,
      success(res) {
        resolve(res)// {data,headers,...}
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

//获取wxcode 
const fetchWxCode = function () {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        resolve(res)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

// 查看是否授权
const getWxSetting = function () {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success(res) {
        resolve(res)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

// 打开地图选择位置
const getWxAuthorize = function (scopeType) {
  return new Promise((resolve, reject) => {
    wx.authorize({
      scope: scopeType,
      success(res) {
        resolve(res)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

// 打开地图选择位置
const getWxLocation = function () {
  return new Promise((resolve, reject) => {
    wx.chooseLocation({
      success(res) {
        resolve(res)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}


//获取用户个人信息    在用户已授权的情况下调用此接口，可成功获取用户信息,否则直接fail。
const fetchWxUserInfo = function () {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success(res) {
        resolve(res)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}


//给后台发送 加密data+iv+authCode
const loginWithWxCode = function (data) {

  const url = 'login/weChatLogin',
    method = 'post';
  return $ajax(url, method, data).then(res => {

    if (res.data) {
      return Promise.resolve(res.data);
    } else {
      return Promise.reject(res);
    }
  }).catch(err => {
    return Promise.reject(err);
  })
}


// 测试登录   手机号
const testLogin = function (data) {

  const url = 'login/testLogin',
    method = 'post';
  return $ajax(url, method, data).then(res => {
    if (res.data) {
      return Promise.resolve(res.data);
    } else {
      return Promise.reject(res);
    }
  }).catch(err => {
    return Promise.reject(err);
  })
}

// 获取微信openId
const getWXOpenId = function (authCode) {

  const url = 'login/getWXOpenId',
    method = 'post';
  const data = { authCode }
  return $ajax(url, method, data).then(res => { //res {result ,data, message}
    if (res.data) {
      return Promise.resolve(res.data);
    } else {
      return Promise.reject(res);
    }
  }).catch(err => {
    return Promise.reject(err);
  })
}

// 
const getWXUserPhone = function (data) {

  const url = 'login/getWXUserPhone',
    method = 'post';
  return $ajax(url, method, data).then(res => {
    if (res.data) {
      return Promise.resolve(res.data);
    } else {
      return Promise.reject(res);
    }
  }).catch(err => {
    return Promise.reject(err);
  })
}
export {
  fetchWxCode,
  getWxSetting,
  fetchWxUserInfo,
  loginWithWxCode,
  testLogin,
  getWxLocation,
  getWxAuthorize,
  getWXOpenId,
  getWXUserPhone
}