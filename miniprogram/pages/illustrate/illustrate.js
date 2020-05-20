// miniprogram/pages/illustrate/illustrate.js
const db = wx.cloud.database();
const $ = db.command.aggregate;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    family_data: []
  },
  onChange(e) {
    this.setData({
      value: e.detail,
    });
  },
  onClick(e) {
    console.log(this.data.value)
  },
  load_img_family() {
    db.collection('succulent_plants').aggregate()
      .sort({ family: 1})
      .sort({ genus: 1 })
      .sort({ name: 1 })
      .group({
        _id: '$family',
        img: $.first('$img')
      })
      .end()
      .then(res => {
        this.setData({
          family_data: res.list
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
  goto_genus(e) {
    let family = e.currentTarget.dataset.family;
    console.log("family:", family);
    wx.navigateTo({
      url: '../genus/genus?family=' + family,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.load_img_family();
  }
})