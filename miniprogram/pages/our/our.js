// miniprogram/pages/our/our.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show_msg: false,
    show_our: false,
    background: [
      'cloud://mycloud2.6d79-mycloud2-1302182014/succulent_plants_img/baifeng.jpg',
      'cloud://mycloud2.6d79-mycloud2-1302182014/succulent_plants_img/baimudan.jpg',
      'cloud://mycloud2.6d79-mycloud2-1302182014/succulent_plants_img/chulian.jpg'
      ]
  },
  click_img(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.img, // 需要预览的图片http链接列表
      urls: this.data.background
    })
  },
  goto_my_share(e) {
    console.log("click1:")
    getApp().globalData.back = true;
    wx.switchTab({
      url: '../share/share',
    })
  },
  goto_contact() {
    Dialog.alert({
      title: '意见反馈',
      message: '即将打开客服会话',
      closeOnClickOverlay: true,
      confirmButtonOpenType: 'contact'
    }).then(() => {
      // on close
    });
  },
  show_edition() {
    Dialog.alert({
      title: '版本更新',
      message: '图鉴新增:白凤，白牡丹\n紫珍珠',
      closeOnClickOverlay: true
    }).then(() => {
      // on close
    });
  },
  show_our() {
    this.setData({
      show_our: true
    })
  },
  click_ewm() {
    wx.previewImage({
      current: 'cloud://mycloud2.6d79-mycloud2-1302182014/ewm.jpg', // 需要预览的图片http链接列表
      urls: ['cloud://mycloud2.6d79-mycloud2-1302182014/ewm.jpg']
    })
  },
  // onClose(){
  //   this.setData({
  //     show_our: false
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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