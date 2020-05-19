// miniprogram/pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index_img: ''
  },
  onLoad() {
    const db = wx.cloud.database()
    db.collection('my_images').where({
        name: "index_img"
      }).get({
      success: res => {
        console.log("res.data", res.data)
        this.setData({
          index_img: res.data[0].fileID
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '图片加载失败'
        })
        console.error('图片加载失败：', err)
      }
    })
  },
})
