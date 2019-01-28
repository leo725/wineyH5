<template>
<div class="container">
  <div class="banner-box">
    <!-- <img v-for="(item,index) in goodsImg" v-if="index<goodsImg.length-1" :src="item"> -->
    <img v-if="goodsInfo.logo" :src="'http://apppay.oss-cn-hangzhou.aliyuncs.com/'+goodsInfo.logo">
  </div>
  <div class="infobox">
    <div class="title">
      <h5><span>{{goodsInfo.currencyName}}</span></h5>
      <div>
        <b>运费 {{goodsInfo.ogisticsPrice}}Wcoin</b>
      </div>
    </div>
    <h6>{{goodsInfo.goodsName}}</h6>
    <p>
      <span>库存{{goodsInfo.stockNumber}}</span><b>|</b><span>{{goodsInfo.sendAddress}}</span>
    </p>
  </div>
  <div class="lines"></div>
  <div class="choice-div">
    <div class="result result1" @click="showModel=true;showBtn=true">
      <div class="left">
        选择兑换数量
      </div>
      <div class="right">
        <img src="../../assets/img/icon-dot.png">
      </div>
    </div>
    <div class="result result2" @click="showParameter=true;">
      <div class="left">
        产品参数
      </div>
      <div class="right">
        <img src="../../assets/img/icon-right.png">
      </div>
    </div>
  </div>
  <div class="lines"></div>
  <div class="leave-word">
    <div class="result3">
      <h5>兑换规则</h5>
      <div class="rule">
        <p>1、兑换商品10个工作日内寄出，海外商品收取一定关税和邮费；</p>
        <p>2、除商品质量问题外，概不退货；</p>
        <p>3、最终解释权归***所有。</p>
      </div>
    </div>
  </div>
  <div class="lines"></div>
  <div class="details">
    <h5>详情介绍</h5>
    <img v-for="(item,index) in detailsImg" :src="'http://apppay.oss-cn-hangzhou.aliyuncs.com/'+item">
    <!-- <img :src="goodsInfo.detailsPicture"> -->
  </div>
  <div class="footState">
    <div class="btn" @click="showModel=true;">立即兑换</div>
  </div>
  <!--弹框选择数量-->
  <div class="modelPop" v-if="showModel">
    <div class="alert-model">
      <span class="close" @click="showModel=false;">
          <img src="../../assets/img/alert-close.png">
        </span>
      <div class="modelInfo">
        <div class="model-top clearfix">
          <div class="left">
            <img v-if="goodsInfo.logo" :src="'http://apppay.oss-cn-hangzhou.aliyuncs.com/'+goodsInfo.logo">
          </div>
          <div class="right">
            <h5>{{goodsInfo.goodsName}}</h5>
            <p>{{goodsInfo.currencyName}}</p>
          </div>
        </div>
        <div class="model-bottom">
          <p>选择数量<span>可用{{useNum}}个</span></p>
          <div>
            <i class="btn minus" @click="numbers=numbers==1?1:numbers-1"></i>
            <input type="text" @input="handleInput" @paste="handleInput" name="" v-model="numbers">
            <i class="btn add" @click="numbers=numbers==useNum?useNum:numbers+1"></i>
          </div>
        </div>
        <div class="foot-btn" v-if="showBtn">
          <div></div>
          <div class="btn btn-buy" @click="suerBuy()">确认兑换</div>
        </div>
      </div>
    </div>
  </div>
  <!--参数弹框-->
  <mt-popup v-model="showParameter" popup-transition="popup-fade" position="bottom">
    <div class="popup-main parameter-model">
      <span class="close" @click="showParameter=false;">
          <img src="../../assets/img/alert-close.png">
        </span>
      <h3>产品参数</h3>
      <div class="parameter-img">
        <img v-for="item in paramsLogo" :src="'http://apppay.oss-cn-hangzhou.aliyuncs.com/'+item" class="imgs">
      </div>
    </div>
  </mt-popup>
  <div>
  </div>
</div>
</template>
<script>
export default {
  data() {
    return {
      showHot: true, //判断是否显示热门搜索
      pageNum: 0,
      numbers: 1,
      showModel: false,
      showBtn: true, //判断点击的是选择数量否
      goodsId: 0, //商品id
      showParameter: false,
      keyShow: false,
      useNum: 10,
      goodsInfo: {},
      detailsImg: [], //接收详情图
      paramsLogo: [] //接收商品图
    }
  },
  mounted() {},
  created() {
    this.getInfo();
  },
  methods: {
    //跳转页面
    targetInfo(url) {

    },
    handleInput(e) {
      this.numbers = e.target.value.replace(/[^\d]/g, '');
      this.numbers = this.numbers >= this.useNum ? this.useNum : this.numbers;
      // this.numbers = this.numbers <= 0 ? 1 : this.numbers;
    },
    //点击确认购买或者加入购物车
    suerBuy() {
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
      sessionStorage.removeItem('orderObj');
      sessionStorage.removeItem('selectedAddress');
      this.$router.replace({
        path: '/wcoin/writeOrder',
        query: {
          goodsId: this.goodsInfo.goodsId,
          num: this.numbers
        }
      })
    },
    //获取商品详情
    getInfo() {
      var params = {
        goodsId: this.$route.query.id
      }
      this.$http.post('/apis' + '/my_red_wine/info.htm', this.Qs.stringify(params)).then(res => {
        if (res.retCode == 0) {
          this.goodsInfo = res.data;
          this.detailsImg = this.subSplit(this.goodsInfo.detailsPicture, ';')
          this.paramsLogo = this.subSplit(this.goodsInfo.paramLogo, ';')
          this.useNum = this.goodsInfo.availableNum; //赋值可用币数

        } else if (res.retCode == "10002") {
          this.$router.replace({
            path: '/wcoin/login'
          })
        }
      })
    },
    //截取拼接的字符串
    subSplit(str, type) {
      if (!str) {
        return false;
      }
      var arr = str.split(type);
      return arr;
    }
  }
}
</script>
<style scoped>
.container {
  padding-bottom: 120px;
}

.banner-box {
  width: 100%;
  height: 750px;
  overflow: hidden;
}

.banner-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.swiper-container>>>.swiper-pagination {
  width: inherit;
  width: inherit;
  left: inherit;
  right: 40px;
  bottom: 40px;
  padding: 0 20px;
  height: 45px;
  line-height: 45px;
  background-color: rgba(0, 0, 0, 0.45);
  color: #fff;
}

.swiper-container>>>.swiper-pagination span {
  color: #fff;
}

.infobox {
  background-color: #fff;
  padding: 30px 40px;
}

.title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.title h5 {
  font-size: 38px;
  color: #E50026;
}

.title span {
  font-size: 32px;
  color: #E50026;
}

.title>div {}

.title b {
  font-size: 30px;
  color: #E50026;
  margin-left: 5px;
  position: relative;
  top: 3px;
}

.infobox h6 {
  font-size: 38px;
  color: #333333;
}

.infobox p {
  margin-top: 16px;
}

.infobox p span {
  font-size: 24px;
  color: #CCCCCC;
}

.infobox p b {
  color: #CCCCCC;
  width: 1px;
  height: 20px;
  display: inline-block;
  margin: 0 30px;
  position: relative;
  top: -2px;
}

.lines {
  width: 100%;
  height: 20px;
  background-color: #f2f2f2;
}

.choice-div {
  padding-left: 40px;
}

.result {
  display: flex;
  justify-content: space-between;
  height: 110px;
  padding-right: 40px;
}

.result1 {
  border-bottom: 1px solid #eee;
}

.result .left {
  font-size: 32px;
  color: #666666;
  height: 110px;
  line-height: 110px;
}

.result .right {}

.result .right img {
  position: relative;
  top: 33px;
  width: 30px;
}

.result2 .right img {
  top: 42px;
  width: 13.3px;
}

.leave-word {
  padding: 0 40px;
}

.result3 {
  padding: 30px 0;
}

.result3 h5 {
  font-size: 36px;
  color: #333333;
}

.result3 .rule {
  margin-top: 30px;
}

.result3 p {
  font-size: 28px;
  color: #333333;
  line-height: 42px;
}

.details {}

.details h5 {
  padding: 0 40px;
  padding-top: 30px;
  padding-bottom: 37px;
  font-size: 36px;
  color: #333333;
}

.details img {
  display: block;
  width: 100%;
}

.footState {
  position: fixed;
  bottom: 0;
  width: 100%;
  left: 0;
  height: 120px;
  padding: 0 20px;
  background-color: #fff;
  border: 1px solid #F7F6F5;
}

.footState .btn {
  float: right;
  width: 344px;
  height: 80px;
  background-color: #E50026;
  text-align: center;
  line-height: 80px;
  color: #fff;
  font-size: 32px;
  margin-top: 20px;
}

.modelPop {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  height: 100%;
  z-index: 10;
}

.alert-model {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  height: 656px;
}

.close {
  position: absolute;
  top: 0;
  right: 0;
}

.close img {
  width: 70px;
}

.model-top {
  padding: 40px;
  padding-right: 120px;
  overflow: hidden;
}

.model-top .left {
  float: left;
  padding-right: 30px;
}

.model-top .left img {
  width: 200px;
  height: 200px;
}

.model-top .right {
  float: left;
  margin-top: 30px;
}

.model-top .right h5 {
  width: 355px;
  font-size: 32px;
  color: #333333;
}

.model-top .right p {
  font-size: 32px;
  color: #E50026;
  margin-top: 35px;
}

.model-bottom {
  display: flex;
  justify-content: space-between;
  margin-top: 80px;
  padding: 0 40px;
}

.model-bottom p {
  font-size: 32px;
  color: #666666;
}

.model-bottom p span {
  font-size: 28px;
  color: #999999;
  margin-left: 15px;
}

.model-bottom div {}

.model-bottom .btn {
  width: 44px;
  height: 44px;
  color: #fff;
  background-color: #ccc;
  font-size: 32px;
  display: inline-block;
  text-align: center;
  line-height: 40px;
  float: left;
  background:url(../../assets/img/icon-jia.png) no-repeat;
  background-size: 100%;
}

.model-bottom .minus {
  margin-right: 1px;
  background-image:url(../../assets/img/icon-jian.png);
}

.model-bottom input {
  width: 84px;
  height: 44px;
  font-size: 28px;
  color: #333333;
  text-align: center;
  background-color: #F2F2F2;
  float: left;
  margin: 0 5px;
}

.foot-btn {
  position: absolute;
  bottom: 20px;
  width: 100%;
  left: 0;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
}

.foot-btn .btn {
  width: 345px;
  height: 80px;
  border: 2px solid #E50026;
  line-height: 76px;
  font-size: 32px;
  color: #E50026;
  text-align: center;
}

.foot-btn .btn-buy {
  background-color: #E50026;
  color: #fff;
}

.parameter-model {
  height: 100%;
  padding: 40px;
}

.parameter-model .close {
  right: 20px;
  top: 20px;
  width: 70px;
}

.parameter-model h3 {
  font-size: 54px;
  color: #000000;
  margin-bottom: 60px;
}

.parameter-model img {
  width: 100%;
}

.parameter-alert {
  overflow: hidden;
}

.parameter-img {
  height: 89%;
  overflow: scroll;
  width: 100%;
  padding-bottom: 20px;
}

.mint-popup {
  width: 100%;
  height: 100%;
}
</style>
