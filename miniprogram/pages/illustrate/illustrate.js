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
    if (this.data.value == "") {
      this.load_img_family();
    }
  },
  onSearch() {
    this.onClick();
  },
  onClick() {
    let temp = this.data.value.replace(/(^\s*)|(\s*$)/g, "");
    if (temp != "") {
      if (temp.substr(-1) == "科") {
        this.load_img_family(temp);    //搜索该科
      } else if (temp.substr(-1) == "属") {
        this.search_genus(temp);      //搜索该属
      } else {
        this.search_name(temp);       //搜索该名字
      }
    }
  },
  load_img_family(temp) {
    db.collection('succulent_plants').aggregate()
      .sort({
        family: 1,
        genus: 1,
        name: 1
      })
      .group({
        _id: '$family',
        img: $.first('$img')
      })
      .end()
      .then(res => {
        if (temp != undefined) {
          let flag = 0;
          for (let i = 0; i < res.list.length; i++) {
            if (res.list[i]._id == temp) {
              flag = 1;
              this.setData({
                family_data: [res.list[i]]
              })
              break;
            }
          }
          if(flag == 0) {
            wx.showToast({
              icon: 'none',
              title: '未搜到结果',
            })
          }
        } else {
          this.setData({
            family_data: res.list
          })
        }
      })
      .catch(err => {
        wx.showToast({
          icon: 'none',
          title: '图片加载失败',
        })
        console.error('图片加载失败', err);
      })
  },
  search_genus(temp) {
    db.collection('succulent_plants').where({genus: temp}).get()
      .then(res => {
        if (res.data.length == 0) {
          wx.showToast({
            icon: 'none',
            title: '未搜到结果',
          })
        } else {
          wx.navigateTo({
            url: '../genus/genus?genus=' + temp,
          })
        }
      })
      .catch(err => {
        console.error('查询失败', err);
      })
  },
  search_name(temp) {
    db.collection('succulent_plants').where({ name: temp }).get()
      .then(res => {
        if (res.data.length == 0) {
          wx.showToast({
            icon: 'none',
            title: '未搜到结果',
          })
        } else {
          wx.navigateTo({
            url: '../detail/detail?name=' + temp,
          })
        }
      })
      .catch(err => {
        console.error('查询失败', err);
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
    this.setData({
      value: ""
    });
    this.load_img_family();
  }
})