// miniprogram/pages/detail/detail.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {}
  },
  load_img_info(name) {
    db.collection('succulent_plants').where({
      name: name
    }).get()
      .then(res => {
        this.setData({
          detail: res.data[0]
        })
        console.log("detail", this.data.detail);
      })
      .catch(err => {
        wx.showToast({
          icon: 'none',
          title: '信息加载失败',
        })
        console.error('信息加载失败', err);
      })
  },
  click_img() {
    wx.previewImage({
      current: this.data.detail.img, // 需要预览的图片http链接列表
      urls: [this.data.detail.img]
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.load_img_info(options.name);
    console.log("options.name: ", options.name)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})