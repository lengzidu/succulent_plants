// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  /**
    * npm install crypto-js request
    */
  var CryptoJS = require("crypto-js");
  // var request = require('request');
  var querystring = require('querystring');
  // return false

  // 云市场分配的密钥Id
  var secretId = "AKIDOR4ieyAR6d66a3X7fJ7GizIUGVmKkQf5a7ED";
  // 云市场分配的密钥Key
  var secretKey = "ExQLgZ3E4C5PoCWaTdSNA176QAT12le4Cb0h8WN";
  var source = "market";
  // 签名
  var datetime = (new Date()).toGMTString();
  var signStr = "x-date: " + datetime + "\n" + "x-source: " + source;
  var sign = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(signStr, secretKey))
  var auth = 'hmac id="' + secretId + '", algorithm="hmac-sha1", headers="x-date x-source", signature="' + sign + '"';
  // 请求方法
  var method = 'POST';
  // 请求头
  var headers = {
    "X-Source": source,
    "X-Date": datetime,
    "Authorization": auth,
  }
  // 查询参数
  var queryParams = {
  }
  // body参数（POST方法下）
  var bodyParams = {
    'photo': event.img
  }
  // url参数拼接
  var url = 'https://service-b417w2y4-1256122842.gz.apigw.tencentcs.com/release/zwsb';
  if (Object.keys(queryParams).length > 0) {
    url += '?' + querystring.stringify(queryParams);
  }
  var options = {
    url: url,
    timeout: 5000,
    method: method,
    headers: headers
  }
  if (['POST', 'PUT', 'PATCH'].indexOf(method) != -1) {
    options['body'] = querystring.stringify(bodyParams);
    options['headers']['Content-Type'] = "application/x-www-form-urlencoded";
  }
  return options;
  // request(options, function (error, response, body) {
  //   console.log("into request: ", error)
  //   if (error !== null) {
  //     console.log('error:', error);
  //     return;
  //   }
  //   console.log("finally:", body)
  //   // console.log(body.data[0].name);
  //   console.log(body);
  //   // return body;
  // });
  // // return event.img
  // wx.request({
  //   url: 'http://www.baidu.com',
  //   success(e) {
  //     console.log(success)
  //   },
  //   complete(e) {
  //     console.log(123)
  //   }
  // })
  // request('http://www.baidu.com', function (error, response, body) {
  //   if (!error && response.statusCode == 200) {
  //     console.log("into: ", body) // 打印google首页
  //     return 0;
  //   }else {
  //     console.log("error")
  //     return 1;
  //   }
  // })
}