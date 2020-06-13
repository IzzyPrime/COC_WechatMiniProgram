const db = wx.cloud.database();
const coc = db.collection('coc')
Page({
  data:{
    image:null,
    des:null,
    link:null,
    hq:null,
    hq2:null,
    timestamp:null
  },

  desChange(event){
    this.data.des = event.detail;
  },
  linkChange(event){
    this.data.link = event.detail
  },
  hqChange(event){
    this.data.hq = event.detail
  },
  selectImage:function(e){
    wx.chooseImage({
      complete: res => {
        wx.cloud.uploadFile({
          cloudPath: `pic/${Math.floor(Math.random()*10000000)}.jpg`,
          filePath: res.tempFilePaths[0]
        }).then(res => {
          this.setData({
            image: res.fileID
          })
        }).catch(err => {
          console.error(err)
        })
      },
    })
  },

  onSubmit:function(event){
    this.data.timestamp = Date.parse(new Date());
      coc.add({
        data:{
          des: this.data.des,
          link: this.data.link,
          hq: this.data.hq,
          hq2: this.data.hq,
          hot: 1,
          eav: false,
          img: this.data.image,
          timestamp: this.data.timestamp
        }
      }).then(res => {
        console.log(res)
        wx.showToast({
          title: '感谢您的支持',
          icon: 'success',
          //跳转
          //success: res2 =>{
          //  wx.redirectTo({
          //    url: '../index/index',
          //  })
          //}
        })
      })
  }
})