const db = wx.cloud.database();
const coc = db.collection('coc')
const _ = db.command
Page({
  data: {
    info: [],
    option1: [
      { text: '大本等级', value: '0' },
      { text: '夜世界请往下划', value: '1' },
      { text: '13本', value: '13' },
      { text: '12本', value: '12' },
      { text: '11本', value: '11' },
      { text: '10本', value: '10' },
      { text: '9本', value: '9' },
      { text: '8本', value: '8' },
      { text: '7本', value: '7' },
      { text: '6本', value: '6' },
      { text: '5本', value: '5' },
      { text: '4本', value: '4' },
      { text: '夜9本', value: '29' },
      { text: '夜8本', value: '28' },
      { text: '夜7本', value: '27' },
      { text: '夜6本', value: '26' },
      { text: '夜5本', value: '25' },
      { text: '夜4本', value: '24' },
    ],
    option2: [
      { text: '时间顺序', value: 'timestamp' },
      { text: '人气顺序', value: 'hot' },
    ],
    value1: '0',
    value2: 'timestamp',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },
  
  //触底刷新
  onReachBottom:function(){
    //this.onSwitchChange();
  },


  //大本等级
  onSwitchChange1:function(event){
    this.data.value1 = event.detail;
    this.onSwitchChange();
  },

  //人气顺序
  onSwitchChange2:function(event){
    this.data.value2 = event.detail;
    this.onSwitchChange();
  },

  //根据选择刷新主页
  onSwitchChange:function(){
    if(this.data.value2 === "timestamp"){
      if(this.data.value1 === "0"){
        this.getData();
      }else{
        this.getData2(null,this.data.value1)
      }
    }
    else{//hot
      if(this.data.value1 === "0"){
        this.getDataHot();
      }else{
        this.getDataHot2(null,this.data.value1)
      }
    }
  },

  //下拉刷新
  onPullDownRefresh:function(){
    this.getData(res => {
      wx.stopPullDownRefresh({
        complete: (res) => {},
      })
    })
  },

  
  //默认数据排列方式
  getData:function(callback){
    if(!callback){
      callback = res => {}
    }
    wx.showLoading({
      title: '加载中',
    })
    coc.where({
      "eav": _.eq(true)
    })
    .orderBy('timestamp', 'desc')
    .get().then(res => {
      this.setData({
        info: res.data
      },res =>{
        wx.hideLoading();
        callback();
      })
    })
  },


  //人气
  getDataHot:function(callback){
    if(!callback){
      callback = res => {}
    }
    wx.showLoading({
      title: '加载中',
    })
    coc
    .where({
      eav: true,
    })
    .orderBy('hot', 'desc')
    .get().then(res => {
      this.setData({
        info: res.data
      },res =>{
        wx.hideLoading();
        callback();
      })
    })
  },

  //时间2
  getData2:function(callback,hq){
    if(!callback){
      callback = res => {}
    }
    wx.showLoading({
      title: '加载中',
    })
    coc.where({
      "eav": _.eq(true),
      "hq": _.eq(hq)
    })
    .orderBy('timestamp', 'desc')
    .get().then(res => {
      this.setData({
        info: res.data
      },res =>{
        wx.hideLoading();
        callback();
      })
    })
  },

    //人气2
    getDataHot2:function(callback,hq){
      if(!callback){
        callback = res => {}
      }
      wx.showLoading({
        title: '加载中',
      })
      coc
      .where({
        eav: true,
        "hq": _.eq(hq)
      })
      .orderBy('hot', 'desc')
      .get().then(res => {
        this.setData({
          info: res.data
        },res =>{
          wx.hideLoading();
          callback();
        })
      })
    },

  //存储跳过的数据数
  pageData:function(){
    skip:0
  },

  //点击复制
  copyText: function(e){
    var id = e.currentTarget.dataset.text._id
    coc.doc(id).update({
      data: {
        // 表示指示数据库将字段自增 1
        hot: _.inc(1)
      },
      success: function(res) {
        console.log(res.data)
      }
    })
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text.link,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
})