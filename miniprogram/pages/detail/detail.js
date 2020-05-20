// miniprogram/pages/detail/detail.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    detail: []
  },
  load_img_info() {
    db.collection('succulent_plants').where({
      name: this.data.name
    }).get()
      .then(res => {
        this.setData({
          detail: res.data
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      name: options.name
    })
    this.load_img_info();
    console.log("this.data.name: ", this.data.name)
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