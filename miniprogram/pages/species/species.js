// miniprogram/pages/species/species.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    genus: '',
    species_data: []
  },
  load_img_species() {
    db.collection('succulent_plants').where({
      genus: this.data.genus
    }).field({
      name: true,
      img: true
    })
    .orderBy('name', 'asc').get()
    .then(res => {
      this.setData({
        species_data: res.data
      })
    })
    .catch(err => {
      wx.showToast({
        icon: 'none',
        title: '图片加载失败',
      })
      console.error('图片加载失败', err);
    })
  },
  goto_detail(e) {
    let name = e.currentTarget.dataset.name;
    console.log("name:", name);
    wx.navigateTo({
      url: '../detail/detail?name=' + name,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      genus: options.genus
    })
    this.load_img_species();
    console.log("this.data.genus: ", this.data.genus)
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