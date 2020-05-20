// miniprogram/pages/genus/genus.js
const db = wx.cloud.database();
const $ = db.command.aggregate;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    family: '',
    genus_data: []
  },
  load_img_genus() {
    db.collection('succulent_plants').aggregate()
      .match({
        family: this.data.family
      })
      .sort({ genus: 1 })
      .sort({ name: 1 })
      .group({
        _id: '$genus',
        img: $.first('$img')
      })
      .end()
      .then(res => {
        this.setData({
          genus_data: res.list
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
  goto_species(e) {
    let genus = e.currentTarget.dataset.genus;
    console.log("genus:", genus);
    wx.navigateTo({
      url: '../species/species?genus=' + genus,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      family: options.family
    })
    this.load_img_genus();
    console.log("this.data.family: ", this.data.family)
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