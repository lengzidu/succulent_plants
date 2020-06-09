// miniprogram/pages/index/index.js
const app = getApp()
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    img_url: ''
  },
  from_camera() {
    this.get_img("camera");
  },
  from_album() {
    this.get_img("album");
  },
  get_img(type) {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: [type],
      success: res => {
        console.log("size", res.tempFiles)
        this.setData({ show: true });
        // this.judge_img(res.tempFilePaths[0]);
        this.judge_img(wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], "base64"));
      }
    })
  },
  judge_img(img_url) {
    var that = this;
    wx.cloud.callFunction({
      name: 'judge_img',
      data: {
        img: img_url
      },
      success: res => {
        console.log(res.result)
        // console.log("body:", "photo=" + img_url, typeof ("photo=" + img_url))
        var options = res.result;
        wx.request({
          url: options.url,
          data: options.body,
          method: options.method,
          timeout: options.timeout,
          header: options.headers,
          success(res) {
            console.log("res.data: ", res.data);

            if (JSON.stringify(res.data.result) != "{}") {
              console.log("name: ", res.data.result.data[0].name);
              that.search_result(res.data.result.data[0].name);
            }else {
              that.setData({ show: false });
              wx.showToast({
                icon: 'none',
                title: '无法识别，请重试'
              })
            }
          },
          fail(err) {
            that.setData({ show: false });
            wx.showToast({
              icon: 'none',
              title: '网络请求失败'
            })
          }
        })
      },
      fail: err => {
        that.setData({ show: false });
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数]调用失败：', err)
      }
    })
  },
  search_result(search) {
    db.collection('succulent_plants').where({
      name: search
    }).get()
    .then(res => {
      this.setData({ show: false });
      if (res.data.length == 0) {
        wx.showToast({
          icon: 'none',
          title: '未搜到结果，图鉴正在完善中',
        })
      } else {
        wx.navigateTo({
          url: '../detail/detail?name=' + search,
        })
      }
    })
    .catch(err => {
      this.setData({ show: false });
      console.error('查询失败', err);
    })
  },

  get_openid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid;
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  onLoad() {
    
  },
})