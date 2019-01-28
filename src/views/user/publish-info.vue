<template>
<div class="container">
  <div class="banner-box">
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
  <div class="leave-word" v-if="state=='agree'">
    <router-link :to="{ path: '/wcoin/leaveWord', query: {id:id,state:1} }">
      <div class="result result2 result3">
        <div class="left">
          留言 <span>{{goodsInfo.goodsLeaveCount}}</span>
        </div>
        <div class="right">
          <span>查看全部</span>
          <img src="../../assets/img/icon-right.png">
        </div>
      </div>
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
        </li>
      </ul>
    </router-link>
  </div>
  <div class="lines"></div>
  <div class="details">
    <h5>详情介绍</h5>
    <img v-for="item in detailsImg" :src="'http://apppay.oss-cn-hangzhou.aliyuncs.com/'+item">
  </div>
  <!-- <div class="footer clearfix">
            <div class="btn-icon">
              <img src="../../assets/img/collect.png">
              <p>{{goodsInfo.goodsLeaveCount}}收藏</p>
            </div>
            <div class="btn-icon">
              <router-link :to="{ path: '/wcoin/leaveWord', query: {id:2,state:1} }">
                <div class="img-box">
                  <i>12</i>
                  <img src="../../assets/img/icon-message.png">
                </div>
                  <p>{{goodsInfo.goodsLeaveCount}}留言</p>
              </router-link>
            </div>
          </div> -->
  <div class="footState" v-if="state=='audit'">审核中</div>
  <div class="footState footState_fail" v-if="state=='refuse'">审核未通过</div>
  <!--参数弹框-->
  <mt-popup v-model="showParameter" popup-transition="popup-fade" position="bottom">
      <div class="popup-main parameter-model">
        <span class="close" @click="showParameter=false;">
          <img src="../../assets/img/alert-close.png">
        </span>
        <h3>产品参数</h3>
        <div class="parameter-img">
          <img v-for="item in paramsImg" :src="'http://apppay.oss-cn-hangzhou.aliyuncs.com/'+item" class="imgs">
        </div>
      </div>
  </mt-popup>
  <div>
    <keyboard @changeNum="submitPwd" v-show="keyShow" @closePwd="closekey"></keyboard>
    <reply v-show="replyShow" @sureFun='sureReply'></reply>
  </div>
</div>
</template>
<script>
import keyboard from '@/components/keyboard'
import reply from '@/components/reply'
export default {
  components: {
    keyboard,
    reply
  },
  data() {
    return {
      id: this.$route.query.id, //商品id
      state: this.$route.query.state, //发布商品的审核状态
      showHot: true, //判断是否显示热门搜索
      pageNum: 0,
      numbers: 1,
      isBuy: true, //判断是购买还是购物车
      showBtn: true, //判断点击的是选择数量否
      goodsId: 0, //商品id
      showParameter: false,
      keyShow: false,
      replyShow: false, //留言弹框
      goodsInfo: {},
      leaveList: [],
      detailsImg: [], //接收详情图
      paramsImg: [], //接收参数商品图
    }
  },
  mounted() {},
  created() {
    this.getInfo();
    this.getLeaveWord();
  },
  beforeDestroy() {
    // 页面销毁之前关闭弹窗
    this.$messagebox.close();
  },
  methods: {
    //跳转页面
    targetInfo(url) {

    },
    handleInput(e) {
      this.numbers = e.target.value.replace(/[^\d]/g, '');
      this.numbers = this.numbers <= 0 ? 1 : this.numbers;
    },
    //点击确认购买或者加入购物车
    suerBuy() {
      this.keyShow = true
    },
    //提交支付密码
    submitPwd(num) {
      //完成跳转
      this.$router.push({
        path: '/wcoin/paySuccess',
        query: {
          id: 2
        }
      })
    },
    //关闭支付框
    closekey() {
      this.keyShow = false
    },
    //点击留言发布
    sureReply() {
      this.replyShow = false;
    },
    //获取商品信息
    getInfo() {
      var params = {
        id: this.id,
        type: 'n'
      }
      this.$http.post('/apis' + 'home_goods/detail.htm', this.Qs.stringify(params)).then(res => {
        if (res.retCode == 0) {
          this.goodsInfo = res.data;
          this.detailsImg = this.subSplit(this.goodsInfo.detailsPicture, ';')
          this.paramsImg = this.subSplit(this.goodsInfo.paramLogo, ';')
          //如果是审核未通过
          if (this.state == "refuse") {
            this.$messagebox.confirm('', {
              title: '审核未通过理由',
              message: this.goodsInfo.refuseRemark,
              showCancelButton: false,
            }).then(action => {
              if (action == 'confirm') { //确认的回调

              }
            }).catch(err => {
              if (err == 'cancel') { //取消的回调
              }
            });

          }
        } else if (res.retCode == "10002") {
          this.$router.replace({
            path: '/wcoin/login'
          })
        }
      })
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
            this.leaveList = res.data
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
@import'swiper/dist/css/swiper.min.css';
.container {
  padding-bottom: 120px;
  height: 100%;
  position: relative;
  z-index: 1;
  overflow: scroll;
  -webkit-overflow-scrolling:touch;
}

.banner-box{
  width: 100%;
  height: 750px;
  overflow: hidden;
}

.banner-box img{
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

.leave-word a {
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
  color: #2A2A2A;
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
  border: 1px solid #F7F6F5;
  padding-top: 28px;
}

.footState {
  position: fixed;
  bottom: 0;
  width: 100%;
  left: 0;
  height: 120px;
  background-color: #E50026;
  color: #fff;
  text-align: center;
  line-height: 120px;
  font-size: 38px;
}

.footState_fail {
  background-color: #666;
}

.footer .btn-icon {
  text-align: center;
  float: left;
  width: 50%;
}

.footer .btn-icon .img-box {
  position: relative;
  display: inline-block;
}

.footer .btn-icon i {
  position: absolute;
  display: inline-block;
  padding: 0px 10px;
  border-radius: 18px;
  background-color: #E50026;
  color: #fff;
  font-size: 20px;
  top: -16px;
  right: -30px;
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
  height: 656px;
  z-index: 20;
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
}

.model-bottom .minus {
  margin-right: 1px;
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
}

.parameter-model h3 {
  font-size: 54px;
  color: #000000;
  margin-bottom: 60px;
}

.parameter-model .imgs {
  width: 100%;
}
.parameter-img{
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
  color: #CCCCCC;
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
  background: #E50026;
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
