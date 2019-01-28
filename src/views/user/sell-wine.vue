<template>
<div class="container">
  <common-title title="出售" btn-text="发布" @clickFun="publish"></common-title>
  <div class="main">
    <div class="img-container">
      <div class="img-box">
        <!-- 上传 -->
        <upload v-show="imgArr1.length<=0" accept="image/*" :multiple="false" class="upload" @uploadSuccess="uploadSuccess1">
          <div slot>
            <img src="../../assets/img/cover-img.png" alt="">
            <p>封面图</p>
          </div>
        </upload>
        <div v-if="imgArr1.length>0" class="true-img" @click="pictureDetail(1)">
          <img :src="imgArr1[0].url" alt="">
          <p>封面图</p>
        </div>
      </div>
      <div class="img-box">
        <!-- 上传 -->
        <upload v-show="imgArr2.length<=0" accept="image/*" :limit='6' :multiple="true" class="upload" @uploadSuccess="uploadSuccess2">
          <div slot>
            <img src="../../assets/img/cover-img.png" alt="">
            <p>图文详情图</p>
          </div>
        </upload>
        <div v-if="imgArr2.length>0" class="true-img" @click="pictureDetail(2)">
          <img :src="imgArr2[0].url" alt="">
          <p>图文详情图</p>
        </div>
      </div>
      <div class="img-box">
        <!-- 上传 -->
        <upload v-show="imgArr3.length<=0" accept="image/*" :limit='6' :multiple="true" class="upload" @uploadSuccess="uploadSuccess3">
          <div slot>
            <img src="../../assets/img/cover-img.png" alt="">
            <p>产品参数图</p>
          </div>
        </upload>
        <div v-if="imgArr3.length>0" class="true-img" @click="pictureDetail(3)">
          <img :src="imgArr3[0].url" alt="">
          <p>产品参数图</p>
        </div>
      </div>
    </div>
    <div class="main-container">
      <div class="input-box right-box" @click="goodsPopup=true;">
        <label>红酒名称</label>
        <span>{{selected.goods.goodsName}}</span>
        <img src="../../assets/img/icon-right.png" alt="" class="icon-right">
      </div>
      <div class="input-box right-box">
        <label>红酒分类</label>
        <span>{{selected.goods.classifyName}}</span>
      </div>
      <div class="input-box right-box" @click="currencyPopup=true;">
        <label>币种</label>
        <span>{{selected.goods.currencyName}}</span>
      </div>
      <div class="input-box">
        <label>库存</label>
        <input type="text" v-model="params.number" @input="handleInput" placeholder="输入库存">
      </div>
      <div class="input-box right-box" @click="addressPopup=true;">
        <label>发货地区</label>
        <span>{{selected.sysOgisticsTemplate.name}}</span>
        <img src="../../assets/img/icon-right.png" alt="" class="icon-right">
      </div>
      <div class="input-box">
        <label>发货地址</label>
        <input type="text" v-model="params.sendAddress" placeholder="输入发货地址">
      </div>
      <div class="input-box">
        <label>手续费</label>
        <input type="text" value="10 Wcoin" placeholder="输入手续费" readonly>
      </div>
    </div>
    <p class="other">
      <img src="../../assets/img/icon-info.png" alt="">
      <span>手续费收取规则</span>
    </p>
  </div>

  <!-- 红酒名称 -->
  
    <div class="goods-popup" v-if="goodsPopup">
      <div class="popup-main popup-main-max">
        <p class="between pop-title">
          <span>请选择红酒名称</span>
          <img src="../../assets/img/alert-close.png" alt="" class="close" @click="goodsPopup=false">
        </p>
        <ul class="pop-list">
          <li @click="selectGoods(item)" v-for="item in lists.goodsArr">
            <span class="name">{{item.goodsName}}</span>
            <img src="../../assets/img/icon-select.png" alt="" class='select' v-if="item.goodsName==selected.goods.goodsName">
          </li>
        </ul>
      </div>
    </div>
 

  <!-- 地址弹窗 -->
  <div class="goods-popup" v-if="addressPopup">
    <div class="popup-main">
      <p class="between pop-title">
        <span>请选择发货地区</span>
        <img src="../../assets/img/alert-close.png" alt="" class="close" @click="addressPopup=false">
      </p>
      <ul class="pop-list">
        <li @click="selectAddress(item)" v-for="item in lists.addressArr">
          <span class="name">{{item.name}}</span>
          <img src="../../assets/img/icon-select.png" alt="" class="select" v-if="item.id==selected.sysOgisticsTemplate.id">
        </li>
      </ul>
    </div>
  </div>
</div>
</template>

<script>
import upload from '@/components/upload'
import commonTitle from '@/components/common-title'
export default {
  data() {
    return {
      goodsPopup: false,
      addressPopup: false,
      fileList: [],
      imgArr1: [],
      imgArr2: [],
      imgArr3: [],
      selected: {
        sysOgisticsTemplate: {},
        goods: {}
      },
      lists: {
        addressArr: [], // 地址数组
        goodsArr: [], // 发布红酒所需数据
      },
      params: {
        number: '', // 库存
        sendAddress: '', // 发货地址
      },
      isEdit: this.$route.query.isEdit,
      id: this.$route.query.id
    }
  },
  components: {
    commonTitle,
    upload
  },
  created() {
    this.initGoodsData();
    this.initTemplate();
    this.initDataBySession();
    if (this.isEdit) {
      this.getWineDetail()
    }
  },
  methods: {
    handleInput(e) {
      this.params.number = e.target.value.replace(/[^\d]/g, '');
      if (this.selected.goods.balance < this.params.number) {
        this.params.number = this.selected.goods.balance;
        this.$toast({
          message: "该币种剩余" + this.selected.goods.balance + '个',
          className: 'warning',
          duration: 1200
        });
      }
    },
    // 文件上传成功
    uploadSuccess1(res) {
      this.imgArr1.push(res);
    },
    uploadSuccess2(res) {
      this.imgArr2.push(res);
    },
    uploadSuccess3(res) {
      this.imgArr3.push(res);
    },
    // 如果是编辑，获取红酒详情
    getWineDetail() {
      var params = {
        id: this.id,
        type: 'n'
      }
      this.$http.post('/apis' + 'goods/info.htm', this.Qs.stringify(params)).then(res => {
        if (res.retCode == 0) {
          this.imgArr1 = this.imgStringToArr(res.data.logo);
          this.imgArr2 = this.imgStringToArr(res.data.detailsPicture);
          this.imgArr3 = this.imgStringToArr(res.data.paramLogo);
          this.selected = {
              sysOgisticsTemplate: {
                name: res.data.sysOgisticsTemplateName,
                id: res.data.sysOgisticsTemplateId
              },
              goods: {
                classifyName: res.data.goodsClassifyName,
                currencyName: res.data.currencyName,
                goodsName: res.data.goodsName,
                goodsClassifyId: res.data.goodsClassifyId,
                sysCurrencyId: res.data.sysCurrencyId
              }
            },
            this.params = {
              number: res.data.number,
              sendAddress: res.data.sendAddress
            }
          this.initDataBySession();
        } else if (res.retCode == '10002') {
          this.$router.push('/wcoin/login')
        }
      })
    },
    // 根据历史记录回填数据
    initDataBySession() {
      var sellWineObj = JSON.parse(sessionStorage.getItem('sellWineObj'));
      if (sellWineObj) {
        this.imgArr1 = sellWineObj.imgArr1;
        this.imgArr2 = sellWineObj.imgArr2;
        this.imgArr3 = sellWineObj.imgArr3;
        this.selected = sellWineObj.selected;
        this.params = sellWineObj.params;
      }
    },
    // 清空数据
    clearData() {
      this.imgArr1 = [];
      this.imgArr2 = [];
      this.imgArr3 = [];
      this.selected = {
        sysOgisticsTemplate: {},
        goods: {}
      }
      this.params = {
        number: '', // 库存
        sendAddress: '', // 发货地址
      }
      sessionStorage.removeItem('sellWineObj')
    },
    // 图文详情
    pictureDetail(type) {
      var sellWineObj = {
        imgArr1: this.imgArr1,
        imgArr2: this.imgArr2,
        imgArr3: this.imgArr3,
        selected: this.selected,
        params: this.params
      };
      sessionStorage.setItem('sellWineObj', JSON.stringify(sellWineObj))
      this.$router.push({
        path: '/wcoin/sellPictureDetail',
        query: {
          type: type
        }
      })
    },
    // 初始化红酒数据
    initGoodsData() {
      this.$http.post('/apis' + '/goods/data.htm').then(res => {
        if (res.retCode == 0) {
          this.lists.goodsArr = res.data
        } else if (res.retCode == '10002') {
          this.$router.push('/wcoin/login')
        }
      })
    },
    // 初始化运费模板列表
    initTemplate() {
      this.$http.post('/apis' + 'sys_logistics_template/list.htm').then(res => {
        if (res.retCode == 0) {
          this.lists.addressArr = res.data
        } else if (res.retCode == '10002') {
          this.$router.push('/wcoin/login')
        }
      })
    },
    // 选择红酒分类
    selectGoods(item) {
      if (item.balance <= 0) {
        this.$toast({
          message: "该币种剩余数量不足,请选择其他币种",
          className: 'warning',
          duration: 1200
        });
        return false;
      }
      this.selected.goods = item;
      this.goodsPopup = false;
      if (this.selected.goods.balance < this.params.number) {
        this.$toast({
          message: "该币种剩余" + this.selected.goods.balance + '个',
          className: 'warning',
          duration: 1200
        });
        this.params.number = this.selected.goods.balance;
      }
    },
    // 选择地址
    selectAddress(item) {
      this.selected.sysOgisticsTemplate = item;
      this.addressPopup = false;
    },
    // 发布
    publish() {
      if (this.imgArr1.length <= 0 || this.imgArr2.length <= 0 || this.imgArr3.length <= 0) {
        this.$toast({
          message: "请上传图片",
          className: 'warning',
          duration: 1200
        });
        return false;
      }
      if (!this.params.number || !this.params.sendAddress) {
        this.$toast({
          message: "请输入相关信息",
          className: 'warning',
          duration: 1200
        });
        return false;
      }
      if (!this.selected.goods.goodsName || !this.selected.sysOgisticsTemplate.id) {
        this.$toast({
          message: "请选择相关信息",
          className: 'warning',
          duration: 1200
        });
        return false;
      }
      if (!this.globalData.hasRealInfo) {
        this.$http.post('/apis' + 'user_real/info.htm').then(res => {
          if (res.retCode == '0') {
            if (res.data.realAudit == 'agree') {
              console.log(res.data)
              this.globalData.hasRealInfo = true;
              this.goNext();
            } else {
              this.$toast({
                message: '请先实名认证',
                duration: 1200,
                className: 'warning'
              });
              return false;
            }
          } else if (res.retCode == "10002") {
            this.$router.replace({
              path: '/wcoin/login'
            })
          }
        })
      } else {
        this.goNext();
      }
    },
    goNext() {
      var params = Object.assign({
        goodsName: this.selected.goods.goodsName,
        goodsClassifyId: this.selected.goods.goodsClassifyId,
        sysCurrencyId: this.selected.goods.sysCurrencyId,
        sysOgisticsTemplateId: this.selected.sysOgisticsTemplate.id,
        logo: this.imgUrlString(this.imgArr1),
        detailsPicture: this.imgUrlString(this.imgArr2),
        paramLogo: this.imgUrlString(this.imgArr3),
        goodsPicture: this.imgUrlString(this.imgArr3),
        price: 1
      }, this.params);
      if(this.isEdit){
        params.id=this.id;
      }
      this.$http.post('/apis' + 'goods/save.htm', this.Qs.stringify(params)).then(res => {
        if (res.retCode == 0) {
          this.$toast({
            message: "发布成功",
            className: 'success',
            duration: 1200
          });
          this.clearData();
        } else if (res.retCode == '10002') {
          this.$router.push('/wcoin/login')
        }
      })
    },
    // 图片地址拼接
    imgUrlString(arr) {
      var strArr = [];
      for (let i = 0; i < arr.length; i++) {

        strArr.push(arr[i].url.replace('http://apppay.oss-cn-hangzhou.aliyuncs.com/', ''));
      }
      return strArr.join(';');
    },
    // 图片字符串分割成数组
    imgStringToArr(str) {
      var arr = str.split(';'),
        returnArr = [];
      for (let i = 0; i < arr.length; i++) {
        returnArr.push({
          url: 'http://apppay.oss-cn-hangzhou.aliyuncs.com/' + arr[i]
        })
      }
      return returnArr;
    }
  }
}
</script>

<style scoped>
.container {
  padding-bottom: 100px;
}

.img-container {
  padding-left: 20px;
  overflow: hidden;
  padding-bottom: 50px;
  border-bottom: 2px solid #eee;
}

.img-box {
  width: 210px;
  margin-left: 20px;
  float: left;
}

.img-box .upload img {
  width: 210px;
  display: block;
}

.img-box .upload p,
.img-box .true-img p {
  height: 58px;
  line-height: 58px;
  text-align: center;
  background-color: #e92d4c;
  font-size: 28px;
  color: #ffffff;
}

.true-img {
  position: relative;
  font-size: 0;
}

.true-img img {
  width: 210px;
  height: 210px;
}

.img-box .true-img p {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(229, 0, 38, 0.8);
}

.main-container {
  padding-left: 40px;
  overflow: hidden;
  margin-top: 50px;
}

.main-container .input-box {
  height: 110px;
  line-height: 110px;
  line-height: 110px;
  border-bottom: 2px solid #eee;
  overflow: hidden;
}

.main-container .input-box label {
  display: inline-block;
  width: 136px;
  font-size: 32px;
  color: #666666;
  line-height: 108px;
  vertical-align: middle;
}

.main-container .input-box input {
  font-size: 30px;
  color: #333;
  width: 540px;
  line-height: 110px;
  padding-left: 40px;
}

.right-box {
  position: relative;
}

.right-box .icon-right {
  position: absolute;
  top: 42px;
  right: 40px;
  height: 25.2px;
}

.right-box span {
  padding-left: 40px;
  font-size: 30px;
  color: #333333;
  display: inline-block;
  max-width: 460px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 108px;
  vertical-align: middle
}

.other {
  margin-top: 20px;
  padding-left: 40px;
}

.other img {
  width: 30px;
  vertical-align: middle;
  margin-right: 17px;
}

.other span {
  font-size: 24px;
  color: #333333;
  text-decoration: underline;
  vertical-align: middle;
}

.mint-popup {
  width: 100%;
  height: 100%;
}

.popup-main {
  width: 100%;
  height: 721px;
  padding: 40px;
  padding-right: 0;
}

.popup-main-max {
  height: 100%;
}

.pop-title span {
  font-size: 54px;
  color: #000000;
}

.pop-title img {
  width: 70px;
  height: 70px;
  margin-right: 40px;
}

.pop-list {
  padding-left: 20px;
  margin-top: 24px;
  height: 550px;
  overflow-y: auto;
}

.popup-main-max .pop-list {
  height: 1150px;
}

.pop-list li {
  height: 110px;
  line-height: 110px;
  border-bottom: 2px solid #eee;
  position: relative;
}

.pop-list .name {
  display: inline-block;
  width: 600px;
  font-size: 32px;
  color: #000000;
}

.pop-list .num {
  font-size: 32px;
  color: #999999;
}

.pop-list .select {
  position: absolute;
  right: 60px;
  top: 40px;
  width: 30px;
}
.goods-popup{
   position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: #fff;
}
</style>
