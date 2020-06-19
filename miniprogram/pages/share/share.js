// miniprogram/pages/share/share.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
const db = wx.cloud.database();
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loggged: false,
    is_back: false,
    is_zan: false,
    show: false,
    focus: false,
    openid: "",
    message: "",
    avatarUrl: "",
    nickName: "",
    result: [],
    fileList: [],
    my_zan: [],
    all_info: []
  },

  onGetUserInfo(e) {
    var that = this;
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        nickName: e.detail.userInfo.nickName
      })
    }
    if (this.data.logged){
      if(this.data.is_back == false) {
        wx.showActionSheet({
          itemList: ['我的', '分享'],
          success(res) {
            if (res.tapIndex == 0) {
              that.setData({ is_back: true });
              getApp().globalData.back = true;
              that.show_all(true);
            } else {
              that.setData({ show: true });
            }
          },
          fail(res) {
            console.log(res.errMsg)
          }
        })
      }else {
        if(this.data.result.length == 0) {
          wx.showToast({
            icon: 'none',
            title: '未选择',
          })
        }else {
          this.delete_info();
        }
      }
    }
  },
  delete_info() {
    var that = this;
    Dialog.confirm({
      title: '删除',
      message: '确认删除吗',
      closeOnClickOverlay: true
    })
    .then(() => {
      var flag = 0;
      wx.showLoading({
        title: '删除中',
      })
      for(let i = 0; i < that.data.result.length; i++) {
        db.collection('share').doc(that.data.result[i]).remove()
        .then(res => {
          flag += 1;
          if(flag == that.data.result.length) {
            wx.hideLoading();
            that.show_all(true);
            that.setData({
              result: []
            })
          }
        })
        .catch(err => {
          wx.hideLoading();
          wx.showToast({
            icon: 'none',
            title: '删除失败',
          })
        })
      }
    })
  },
  onClose() {
    this.setData({ show: false });
  },
  get_focus() {
    this.setData({focus: true});
  },
  input_change(e) {
    this.setData({ message: e.detail});
  },
  afterRead(e) {
    var list = this.data.fileList;
    list.push({'url': e.detail.file.path});
    this.setData({
      fileList: list
    })
  },
  delete_img(e) {
    var list = this.data.fileList;
    list.splice(e.detail.index, 1);
    this.setData({
      fileList: list
    })
  },
  submit() {
    var that = this;
    if(this.data.message == "" && this.data.fileList.length == 0) {
      wx.showToast({
        icon: 'none',
        title: '未输入内容',
      })
    }else {
      wx.showLoading({
        title: '发布中',
      })
      var cloud_img = [];
      var timestamp = new Date().getTime();
      var flag = 0;
      var promise = new Promise(function (resolve, reject) {
        for (let i = 0; i < that.data.fileList.length; i++) {
          var filePath = that.data.fileList[i].url;

          // 上传图片
          var cloudPath = "share/" + timestamp + "/" + i + filePath.match(/\.[^.]+?$/)[0];
          wx.cloud.uploadFile({
            cloudPath,
            filePath,
            success: res => {
              console.log('[上传文件] 成功：', res)
              console.log()
              cloud_img[i] = res.fileID;
              console.log("con", cloud_img);
              flag += 1;
              if (flag == that.data.fileList.length) {
                resolve();
              }
            },
            fail: e => {
              console.error('[上传文件] 失败：', e)
              wx.showToast({
                icon: 'none',
                title: '上传失败',
              })
            },
          })
        }
        if(that.data.fileList.length == 0) {
          resolve();
        }
      })
      
      promise.then(() => { 
        var share_time = that.formatDate(new Date(timestamp));
        db.collection('share').add({
          data: {
            nickname: that.data.nickName,
            headimg: that.data.avatarUrl,
            sharetext: that.data.message,
            shareimg: cloud_img,
            zan: 0,
            is_zan: false,
            time: share_time
          }
        })
        .then(res => {
          wx.hideLoading();
          that.setData({
            show: false,
            message: "",
            fileList: []
          })
          that.show_all(false);
        })
        .catch(err => {
          wx.hideLoading();
          wx.showToast({
            icon: 'none',
            title: '发布失败',
          })
        })
      })   
    }
  },
  formatDate(now) {
    var year = now.getFullYear();  //取得4位数的年份
    var month = now.getMonth() + 1;  //取得日期中的月份，其中0表示1月，11表示12月
    var date = now.getDate();      //返回日期月份中的天数（1到31）
    var hour = now.getHours();     //返回日期中的小时数（0到23）
    var minute = now.getMinutes(); //返回日期中的分钟数（0到59）
    var second = now.getSeconds(); //返回日期中的秒数（0到59）
    return year + "-" + month + "-" + date + " " + hour + ":" + minute;
  },

  show_all(is_back) {
    console.log(this.data.is_back)
    var that = this;
    if(is_back) {
      db.collection('share').where({ _openid: this.data.openid }).orderBy('time', 'desc').get()
      .then(res => {
        var arr_temp = [];
        for (let j = 0; j < this.data.my_zan.length; j++) {
          if (that.data.my_zan[j]._openid == that.data.openid) {
            arr_temp.push(that.data.my_zan[j].sid);
          }
        }
        for (let i = 0; i < res.data.length; i++) {
          var num = 0;
          for (let k = 0; k < that.data.my_zan.length; k++) {
            if (res.data[i]._id == that.data.my_zan[k].sid) {
              num += 1;
            }
          }
          res.data[i].zan = num;
          if (arr_temp.indexOf(res.data[i]._id) != -1) {
            res.data[i].is_zan = true;
          }
        }
        this.setData({
          all_info: res.data
        })
      })
    }else(
      db.collection('share').orderBy('time', 'desc').get()
      .then(res => {
        var arr_temp = [];
        for (let j = 0; j < this.data.my_zan.length; j++) {
          if(that.data.my_zan[j]._openid == that.data.openid) {
            arr_temp.push(that.data.my_zan[j].sid);
          }
        }
        for (let i = 0; i < res.data.length; i++) {
          var num = 0;
          for(let k = 0; k < that.data.my_zan.length; k++) {
            if(res.data[i]._id == that.data.my_zan[k].sid) {
              num += 1;
            }
          }
          res.data[i].zan = num;
          if (arr_temp.indexOf(res.data[i]._id) != -1) {
            res.data[i].is_zan = true;
          }
        }
        this.setData({
          all_info: res.data
        })
      })
    )
  },
  back_all() {
    this.setData({is_back: false});
    getApp().globalData.back = false;
    this.show_all(false);
  },
  onChange(event) {
    this.setData({
      result: event.detail,
    });
  },
  click_img(e) {
    var click_info = e.currentTarget.dataset;
    wx.previewImage({
      current: click_info.url, // 当前显示图片的http链接
      urls: click_info.urls // 需要预览的图片http链接列表
    })
  },
  
  dian_zan(e) {
    console.log("ert: ", this.data.all_info)
    var that = this;
    var e_is_zan = e.currentTarget.dataset.is_zan;
    var e_sid = e.currentTarget.dataset.sid;
    var e_index = e.currentTarget.dataset.index;
    var nnumm = this.data.all_info[e_index].zan;
    var zan = !e_is_zan;
    var temp1 = "all_info[" + e_index + "].is_zan";
    var temp2 = "all_info[" + e_index + "].zan";
    console.log(e_index, nnumm);
    var num_temp = zan ? nnumm + 1 : nnumm - 1;
    console.log(num_temp);
    this.setData({
      [temp1]: zan,
      [temp2]: num_temp
      // [temp2]: num_temp
      });
    if(zan) {
      db.collection('dian_zan').add({
        data: {
          sid: e_sid
        }
      })
      .then(res => {
        that.get_my_zan();
        console.log("点赞成功");
      })
      .catch(err => {
        console.log("插入数据失败");
      })
    }else {
      var myzan = this.data.my_zan;
      for(let i = 0; i < myzan.length; i++) {
        console.log("e_sid: ", e_sid);
        console.log(myzan[i].sid == e_sid && myzan[i]._openid == that.data.openid);
        if (myzan[i].sid == e_sid && myzan[i]._openid == that.data.openid) {
          console.log("_id: ", myzan[i]._id)
          db.collection('dian_zan').doc(myzan[i]._id).remove()
          .then(res => {
            that.get_my_zan();
            console.log("取消点赞成功");
            // that.show_all(that.data.is_back);
          })
          .catch(err => {
            console.log("删除数据失败");
          })
        }
      }
      
    }
  },
  get_my_zan() {
    db.collection('dian_zan').get()
    .then(res => {
      this.setData({
        my_zan: res.data
      })
      this.show_all(this.data.is_back);
    })
    .catch(err => {
      console.log("查询失败");
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      is_back: getApp().globalData.back
    })
    //设置回调，防止小程序globalData拿到数据为null    
    getApp().getopenid(res => {
      this.setData({
        openid: res
      })
      this.get_my_zan();
    })
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
    console.log("getApp().globalData.back: ", getApp().globalData.back)
    this.setData({
      is_back: getApp().globalData.back
    })
    this.show_all(getApp().globalData.back);
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