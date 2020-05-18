// miniprogram/pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: "distinguish",
  },
  onChange(event) {
    this.setData({
      active: event.detail
    })
    console.log(this.data.active)
  }
})