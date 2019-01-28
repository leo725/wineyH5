<template>
<div class="container">
  <div class="banner-box">
    <!-- <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <a href="javascript:;">
            <img src="http://apppay.oss-cn-hangzhou.aliyuncs.com//ipfsoss/user/2018/07/24/569a6164-3b92-4a83-92d3-b0e2b8da6d6a.jpg">
          </a>
          </div>
          <div class="swiper-slide">
            <a href="javascript:;">
            <img src="http://apppay.oss-cn-hangzhou.aliyuncs.com//ipfsoss/user/2018/07/24/569a6164-3b92-4a83-92d3-b0e2b8da6d6a.jpg">
          </a>
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div> -->
    <img v-if="goodsInfo.logo" :src="'http://apppay.oss-cn-hangzhou.aliyuncs.com/'+goodsInfo.logo">
  </div>
  <div class="infobox">
    <div class="title">
      <h5><span>{{goodsInfo.currenctName}}</span></h5>
      <div>
        <img :src="goodsInfo.userAvatarUrl">
        <b>{{goodsInfo.userName}}</b>
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
        选择数量
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
    <router-link :to="{ path: '/wcoin/leaveWord', query: {id:id,state:2} }">
      <div class="result result2 result3">
        <div class="left">
          留言 <span>{{goodsInfo.goodsLeaveCount}}</span>
        </div>
        <div class="right">
          <span>查看全部</span>
          <img src="../../assets/img/icon-right.png">
        </div>
      </div>
      <!-- <div class="comment">
          <div class="top">
            <img src="../../assets/img/service.png">
            <span>未知生物</span>
          </div>
          <p class="text">
            这里是留言内容这里是留言内容这里是留言内容这里是留言内容这里是留言内容
          </p>
        </div> -->
      <ul class="list">
        <li v-for="(item,index) in leaveList" v-if="index<3">
          <div class="info">
            <div class="top between">
              <div class="left">
                <img :src="item.userAvatarUrl">
                <b>{{item.nickName}}</b>
              </div>
              <div class="right">
                {{item.createTime|timeNoYear}}
              </div>
            </div>
            <div class="text">
              {{item.content}}
            </div>
            <p v-if="item.apiGoodsLeaveListVoList.length>0">{{item.apiGoodsLeaveListVoList.length}}条回复</p>
          </div>
          <!-- <ul class="list listTwo">
            <li  v-for="(list,num) in item.apiGoodsLeaveListVoList">
              <div class="">
                <div class="top between">
                  <div class="left">
                    <img :src="list.userAvatarUrl">
                    <b>{{list.nickName}}</b>
                  </div>
                  <div class="right">
                    {{list.createTime|timeNoYear}}
                  </div>
                </div>
                <div class="text">
                  <span class="">回复@{{item.nickName}}:</span> {{list.content}}
                </div>
              </div>
            </li>
          </ul> -->
        </li>
      </ul>
    </router-link>
  </div>
  <div class="lines"></div>
  <div class="details">
    <h5>详情介绍</h5>
    <img v-for="(item,index) in detailsImg" :src="'http://apppay.oss-cn-hangzhou.aliyuncs.com/'+item">
  </div>
  <div class="footer">
    <div class="left clearfix">
      <div class="btn-icon" v-if="goodsInfo.isFavourite=='y'" @click="collect('n')">
        <img src="../../assets/img/collect-a.png">
        <p>已收藏</p>
      </div>
      <div class="btn-icon" v-else @click="collect('y')">
        <img src="../../assets/img/collect.png">
        <p>收藏</p>
      </div>
      <div class="btn-icon" @click="targetReply">
        <img src="../../assets/img/icon-message.png">
        <p>留言</p>
      </div>
    </div>
    <div class="right">
      <div class="btn btnCar" @click="isBuy=false;showModel=true;showBtn=false">加入购物车</div>
      <div class="btn btnBug" @click="isBuy=true;showModel=true;showBtn=false">立即购买</div>
    </div>
  </div>
  <!-- <div class="footState">
      审核中
    </div> -->
  <!--弹框选择数量-->
  <div class="modelPop" v-if="showModel" @click="showModel=false;">
  </div>
  <div class="alert-model" v-if="showModel">
    <span class="close" @click="showModel=false;">
        <img src="../../assets/img/alert-close.png">
      </span>
    <div class="modelInfo">
      <div class="model-top clearfix">
        <div class="left">
          <img v-if="goodsInfo.logo" :src="'http://apppay.oss-cn-hangzhou.aliyuncs.com/'+goodsInfo.logo">
        </div>
        <div class="right">
          <h5>{{goodsInfo.goodsName|substr(15)}}</h5>
          <p>{{goodsInfo.currenctName}}</p>
        </div>
      </div>
      <div class="model-bottom">
        <p>选择数量</p>
        <div>
          <i class="btn minus" @click="numbers=numbers==1?1:numbers-1"></i>
          <input type="text" @input="handleInput" @blur="numbers=numbers==''||numbers<=0?1:parseInt(numbers)" name="" v-model="numbers">
          <i class="btn add" @click="numbers=numbers==goodsInfo.stockNumber?goodsInfo.stockNumber:numbers+1"></i>
        </div>
      </div>
      <div class="foot-btn" v-if="showBtn">
        <div class="btn" @click="isBuy=false;suerBuy()">加入购物车</div>
        <div class="btn btn-buy" @click="isBuy=true;suerBuy()">立即购买</div>
      </div>
      <div class="foot-btn" v-else>
        <div></div>
        <div class="btn btn-buy" @click="suerBuy()">确认</div>
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
        <img v-for="item in paramLogo" :src="'http://apppay.oss-cn-hangzhou.aliyuncs.com/'+item" class="imgs">
      </div>
    </div>
  </mt-popup>
  <div>
    <keyboard @changeNum="submitPwd" :other-title="goodsInfo.proportion*numbers+'Wcoin'" v-show="keyShow" @closePwd="closekey"></keyboard>
    <!-- <reply v-show="replyShow" @sureFun='sureReply'></reply> -->
  </div>
</div>
</template>
<script>
import keyboard from '@/components/keyboard'
export default {
  components: {
    keyboard
  },
  data() {
    return {
      id: this.$route.query.id, //商品id
      showHot: true, //判断是否显示热门搜索
      numbers: 1,
      showModel: false,
      isBuy: true, //判断是购买还是购物车
      showBtn: true, //判断点击的是选择数量否
      goodsId: 0, //商品id
      showParameter: false,
      keyShow: false,
      replyShow: false, //留言弹框
      goodsInfo: [],
      detailsImg: [], //接收详情图
      paramLogo: [], // 产品参数图
      pageNum: 0,
      leaveList: [],
      noMoerData: false,
    }
  },
  mounted() {

  },
  created() {
    this.getInfo();
    this.getLeaveWord();
  },
  methods: {
    //添加取消收藏
    collect(type) {
      var params = {
        goodsId: this.id
      }
      this.$http.post('/apis' + 'user_favourite/save.htm', this.Qs.stringify(params)).then(res => {
        if (res.retCode == 0) {
          this.goodsInfo.isFavourite = type;
        } else if (res.retCode == "10002") {
          this.$router.replace({
            path: '/wcoin/login'
          })
        }
      })
    },
    //跳转页面
    targetInfo(url) {

    },
    //获取商品信息
    getInfo() {
      var params = {
        id: this.id
      }
      this.$http.post('/apis' + 'home_goods/detail.htm', this.Qs.stringify(params)).then(res => {
        if (res.retCode == 0) {
          this.goodsInfo = res.data;
          this.detailsImg = this.subSplit(this.goodsInfo.detailsPicture, ';')
          this.paramLogo = this.subSplit(this.goodsInfo.paramLogo, ';')
        } else if (res.retCode == "10002") {
          this.$router.replace({
            path: '/wcoin/login'
          })
        }
      })
    },
    handleInput(e) {
      this.numbers = e.target.value.replace(/[^\d]/g, '');
      // this.numbers=this.numbers<=0?1:this.numbers;
    },
    //失去焦点
    blurInput() {},
    // 确认是否实名认证
    checkPwd() {
      //验证是否有支付密码
      this.$http.post('/apis' + '/user_info/check_password.htm', this.Qs.stringify({})).then(res => {
        if (res.retCode == 0) {
          if (res.data == 'n') {
            this.$toast({
              message: '暂未设置支付密码',
              duration: 1200,
              className: 'warning'
            });
          } else {
            this.keyShow = true
          }
        } else if (res.retCode == "10002") {
          this.$router.replace({
            path: '/wcoin/login'
          })
        }
      })
    },
    //点击确认购买或者加入购物车
    suerBuy() {
      if (this.isBuy) {
        if (!this.globalData.hasRealInfo) {
          this.$http.post('/apis' + 'user_real/info.htm').then(res => {
            if (res.retCode == '0') {
              if (res.data.realAudit == 'agree') {
                this.globalData.hasRealInfo = true;
                this.checkPwd();
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
          this.checkPwd();
        }
      } else {
        //加入购物车
        var params = {
          goodsId: this.id,
          number: this.numbers
        }
        this.$http.post('/apis' + '/user_shopping_cart/save.htm', this.Qs.stringify(params)).then(res => {
          if (res.retCode == 0) {
            this.$toast({
              message: '添加成功',
              duration: 1200,
              className: 'success'
            });
            this.showModel = false
          } else if (res.retCode == "10002") {
            this.$router.replace({
              path: '/wcoin/login'
            })
          }
        })
      }

    },
    //提交支付密码
    submitPwd(num) {
      var params = {
        goodsId: this.id,
        number: this.numbers,
        payPassword: num
      }
      console.log(num)
      this.$http.post('/apis' + 'goods_currency_order/create_order.htm', this.Qs.stringify(params)).then(res => {
        if (res.retCode == 0) {
          sessionStorage.setItem("orderData", JSON.stringify(res.data));
          //完成跳转
          this.$router.push({
            path: '/wcoin/paySuccess',
            query: {
              id: this.id,
            }
          })
        } else if (res.retCode == "10002") {
          this.$router.replace({
            path: '/wcoin/login'
          })
        }
      })

    },
    //关闭支付框
    closekey() {
      this.keyShow = false
    },
    //点击留言发布
    /* sureReply(){
       console.log('发布留言');
       this.replyShow=false;
     }*/
    //跳转留言评论页面
    targetReply() {
      this.$router.push({
        path: '/wcoin/reply',
        query: {
          id: this.id,
          type: 1,
          state: 2
        }
      }) //type1为留言，2为回复,state为2为不能评论的留言页面
    },
    //获取留言列表
    getLeaveWord() {

      var params = {
        goodsId: this.id,
        pageNum: 0 //this.pageNum
      }
      this.$http.post('/apis' + 'goods_leave/goods_list.htm', this.Qs.stringify(params)).then(res => {
        if (res.retCode == 0) {
          if (res.data.length > 0) {
            this.leaveList = this.leaveList.concat(res.data);
            // this.pageNum += 1; //pageNum++
            if (res.data.length < 10) {}
            return false;
          } else {}
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
    },
  }
}
</script>
<style scoped>
@import "swiper/dist/css/swiper.min.css";
.container {
  padding-bottom: 120px;
  /* overflow: scroll;
  height: 100%;
  position: relative; */
  z-index: 1;
  -webkit-overflow-scrolling: touch;
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
  color: #e50026;
}

.title span {
  font-size: 32px;
  color: #e50026;
}

.title>div {}

.title img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  vertical-align: middle;
}

.title b {
  font-size: 28px;
  color: #333333;
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
  color: #cccccc;
}

.infobox p b {
  color: #cccccc;
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

.leave-word>a {
  width: 100%;
}

.result3 {
  padding-right: 0;
}

.result3 .left {
  font-size: 36px;
}

.result3 .left span {
  font-size: 28px;
  color: #2a2a2a;
  position: relative;
  top: -2px;
}

.result2 .right img {
  top: 37px;
}

.result3 .right {
  position: relative;
  top: 3px;
}

.result3 .right span {
  position: relative;
  top: 35px;
  font-size: 28px;
  color: #333333;
  margin-right: 20px;
}

.comment {
  padding-bottom: 55px;
}

.comment .top {
  margin-bottom: 10px;
}

.comment .top img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  vertical-align: middle;
}

.comment .top span {
  font-size: 28px;
  color: #999999;
  margin-left: 10px;
  vertical-align: middle;
}

.comment .text {
  font-size: 28px;
  color: #333333;
  line-height: 40px;
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

.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  left: 0;
  height: 120px;
  padding: 0 20px;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  border: 1px solid #f7f6f5;
}

.footState {
  position: fixed;
  bottom: 0;
  width: 100%;
  left: 0;
  height: 120px;
  background-color: #e50026;
  color: #fff;
  text-align: center;
  line-height: 120px;
  font-size: 38px;
}

.footState_fail {
  background-color: #666;
}

.footer .left {
  width: 240px;
  padding-top: 28px;
}

.footer .btn-icon {
  text-align: center;
  float: left;
  width: 50%;
}

.footer .btn-icon:last-child {
  float: right;
}

.footer .btn-icon img {
  height: 39px;
}

.footer .btn-icon p {
  text-align: center;
  font-size: 24px;
  color: #333333;
}

.footer .right {
  padding-top: 20px;
}

.footer .right .btn {
  display: inline-block;
  border: 2px solid #e50026;
  height: 80px;
  line-height: 76px;
  font-size: 32px;
  color: #e50026;
  text-align: center;
  width: 220px;
}

.footer .right .btnBug {
  color: #fff;
  background-color: #e50026;
  margin-left: 5px;
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
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  min-height: 565px;
  z-index: 20;
}

.parameter-model {
  /*min-height: 100vh;*/
  height: 100%;
}

.close {
  position: absolute;
  top: 0;
  right: 0;
}

.close img {
  width: 70px;
}

.parameter-model h3 {
  margin-bottom: 60px;
}

.parameter-model .imgs {
  width: 100%;
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
  color: #e50026;
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
  background-color: #f2f2f2;
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
  border: 2px solid #e50026;
  line-height: 76px;
  font-size: 32px;
  color: #e50026;
  text-align: center;
}

.foot-btn .btn-buy {
  background-color: #e50026;
  color: #fff;
}

.parameter-model {
  padding: 40px;
}

.parameter-model .close {
  right: 20px;
  top: 20px;
}

.parameter-model h3 {
  font-size: 54px;
  color: #000000;
}

.parameter-img {
  height: 89%;
  overflow: scroll;
  width: 100%;
  padding-bottom: 20px;
}


/*留言部分样式*/

.list {}

.list li {
  padding-top: 30px;
}

.list>li:last-child {
  border-bottom: none;
}

.list img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.list .top {
  margin-bottom: 3px;
}

.list .top .left b {
  font-size: 28px;
  color: #999999;
  position: relative;
  top: -14px;
}

.list .top .left {
  position: relative;
}

.list .top .right {
  font-size: 28px;
  color: #cccccc;
  margin-top: 5px;
}

.list .text {
  font-size: 28px;
  color: #333333;
  line-height: 40px;
  padding-bottom: 20px;
}

.list p {
  color: #999;
  font-size: 26px;
  text-align: right;
  padding-bottom: 30px;
}

.listTwo {
  padding-left: 91px;
}

.info {
  /*padding-right: 40px;*/
}

.list .text span {
  font-size: 28px;
  color: #333333;
}

.list li {
  border-bottom: 1px solid #eee;
}

.listTwo li {
  border: none;
  /*padding-right: 40px;*/
}

.listTwo li:first-child {
  border-top: 1px solid #eee;
}

.noReady {
  position: absolute;
  left: 38px;
  top: 2px;
  width: 15px;
  height: 15px;
  background: #e50026;
  border-radius: 50%;
}

.loadmore-container {
  top: 150px;
}

.mint-popup {
  width: 100%;
  height: 100%;
}
</style>
