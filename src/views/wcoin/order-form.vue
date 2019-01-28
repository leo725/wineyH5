<template>
  <div class="container">
    <common-title title="订单支付"></common-title>
    <div class="order-top between">
      <div class="left">
        {{wcoinOrderInfo.totalPrice?wcoinOrderInfo.totalPrice:wcoinOrderInfo.totalMoney}} EUR
      </div>
      <div class="right">
        <img src="../../assets/img/icon-clock.png">
        <span>{{time}}</span>
      </div>
    </div>
    <div class="card">
      <p class="between card-title">
        <span>卖家收款信息</span>
      </p>
      <p class="between">
        <span>户主姓名</span>
        <i>{{wcoinOrderInfo.realName}}</i>
      </p>
      <p class="between">
        <span>收款银行</span>
        <i>{{wcoinOrderInfo.bankName}}</i>
      </p>
      <p class="between">
        <span>银行卡号<img src="../../assets/img/icon-carf.png" alt=""></span>
        <i>{{wcoinOrderInfo.cardNo}}</i>
      </p>
    </div>
    <ul class="list-box">
      <li class=" between">
        <div class="left">
          上传支付凭证
        </div>
        <div class="right">
          <img src="../../assets/img/icon-right.png" class="f-right icon-right">
          <upload accept="image/*" :multiple="false" class="f-right upload" @uploadSuccess="uploadSuccess">
            <img src="../../assets/img/camera1.png" slot alt="" v-if="!proofImg">
            <img :src="proofImg" slot alt="" v-else>
          </upload>
        </div>
      </li>
      <!--  <li class="img-box between" @click="orderPopup=true">
        <div class="left">
          支付凭证示例
        </div>
        <div class="right">
          <img src="../../assets/img/icon-right.png" class="f-right icon-right">
          <span class="f-right">查看实例</span>
        </div>
      </li> -->
    </ul>
    <div class="hint">
      温馨提示:请确保转账金额与所需支付金额一致，转账至卖家银行卡号后，上传转账支付凭证，我们将很快为你处理
    </div>
    <div class="between btn-box">
      <div class="common-btn grey-btn" @click="closeOrder">取消订单</div>
      <div class="common-btn" @click="promptlyBuy">我已支付</div>
    </div>
    <mt-popup v-model="orderPopup" popup-transition="popup-fade" position="bottom">
      <div class="popup-main popup-main-max">
        <img src="../../assets/img/service.png">
      </div>
      <img src="../../assets/img/pay-close.png" class="close-popup" @click="orderPopup=false">
    </mt-popup>
  </div>
</template>
<script>
  import commonTitle from '@/components/common-title';
  import upload from '@/components/upload'
  var timer;
  export default {
    components: {
      commonTitle,
      upload
    },
    data() {
      return {
        time: '00:00',
        wcoinOrderInfo: {},
        proofImg: '', // 凭证
        orderPopup: false
      }
    },
    created() {
      var wcoinOrderInfo = sessionStorage.getItem('wcoinOrderInfo');
      this.wcoinOrderInfo = JSON.parse(wcoinOrderInfo);
      //递归每秒调用countTime方法，显示动态时间效果
      var date = new Date();
      var now = date.getTime();
      //设置截止时间
      var end = this.wcoinOrderInfo.createTime + 15 * 60 * 1000;
      //时间差
      var leftTime = end - now;
      //定义变量 d,h,m,s保存倒计时的时间
      if (leftTime >= 0) {
        this.countTime();
      }
    },
    mounted() {},
    methods: {
      countTime() {
        clearInterval(timer);
        timer = setInterval(() => {
          //获取当前时间
          var date = new Date();
          var now = date.getTime();
          //设置截止时间
          var end = this.wcoinOrderInfo.createTime + 15 * 60 * 1000;
          //时间差
          var leftTime = end - now;
          //定义变量 d,h,m,s保存倒计时的时间
          if (leftTime >= 0) {
            var d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
            var hh = Math.floor(leftTime / 1000 / 60 / 60 % 24);
            var mm = Math.floor(leftTime / 1000 / 60 % 60);
            var ss = Math.floor(leftTime / 1000 % 60);
            mm = mm >= 10 ? mm : '0' + mm;
            ss = ss >= 10 ? ss : '0' + ss;
            this.time = mm + ':' + ss;
          } else {
            //做取消订单操作
            clearInterval(timer);
            this.$router.back(-1);
          }
        }, 1000)
      },
      // 文件上传成功
      uploadSuccess(res) {
        this.proofImg = res.url;
      },
      //点击立即购买
      promptlyBuy() {
        if (!this.proofImg) {
          this.$toast({
            message: '请上传支付凭证',
            duration: 1200,
            className: 'warning'
          });
          return false;
        }
        var params = {
          id: this.wcoinOrderInfo.id,
          url: this.proofImg.replace('http://apppay.oss-cn-hangzhou.aliyuncs.com/', '')
        }
        this.$http.post('/apis' + '/user_wcoin_order/upload_pay_voucher.htm', this.Qs.stringify(params)).then(res => {
          if (res.retCode == 0) {
            sessionStorage.removeItem("wcoinOrderInfo");
            this.$router.replace({
              path: '/wcoin/orderResult',
              query: {
                type: 1,
                number: this.wcoinOrderInfo.number ? this.wcoinOrderInfo.number : this.wcoinOrderInfo.currencyNumber,
                totalPrice: this.wcoinOrderInfo.totalPrice ? this.wcoinOrderInfo.totalPrice : this.wcoinOrderInfo
                  .totalMoney
              }
            })
          } else if (res.retCode == "10002") {
            this.$router.replace({
              path: '/wcoin/login'
            })
          }
        })

      },
      //取消订单
      closeOrder() {
        this.$messagebox.confirm('', {
          title: '确认取消？',
          message: '是否确认取消该订单？',
        }).then(action => {
          if (action == 'confirm') { //确认的回调
            var params = {
              id: this.wcoinOrderInfo.id,
            }
            this.$http.post('/apis' + '/user_wcoin_order/cancel.htm', this.Qs.stringify(params)).then(res => {
              if (res.retCode == 0) {
                this.$toast({
                  message: '订单取消成功',
                  duration: 1200,
                  className: 'success'
                });
                this.$router.go(-1);
              } else if (res.retCode == "10002") {
                this.$router.replace({
                  path: '/wcoin/login'
                })
              }
            })
          }
        }).catch(err => {
          if (err == 'cancel') { //取消的回调
          }
        });
      }
    },

  }

</script>
<style scoped>
  .order-top {
    margin-bottom: 40px;
    padding: 0 40px;
  }

  .order-top .left {
    font-size: 36px;
    color: #000000;
  }

  .order-top .right {}

  .order-top .right span {
    font-size: 28px;
    color: #000000;
    vertical-align: middle;
    display: inline-block;
    min-width: 115px;
  }

  .order-top .right img {
    width: 32px;
    vertical-align: middle;
  }

  .card {
    margin: 0 auto;
    width: 670px;
    height: 296px;
    background: url(../../assets/img/Bitmap.jpg) no-repeat;
    background-size: 100% 100%;
    padding: 30px 40px;
    margin-bottom: 45px;
  }

  .card p {
    margin-bottom: 25px;
    line-height: 40px;
  }

  .card p img {
    width: 29px;
    margin-left: 20px;
    position: relative;
    top: 3px;
  }

  .card span {
    font-size: 28px;
    color: #666666;
  }

  .card i {
    font-size: 28px;
    color: #333333;
  }

  .card-title span {
    font-size: 36px;
    color: #333333;
  }

  .card-title img {
    height: 25.2px;
    width: 13.3px;
    margin-top: 12px;
  }

  .card .card-title {
    margin-bottom: 35px;
    line-height: 50px;
  }

  .list-box {
    padding-left: 40px;
  }

  .list-box li {
    padding-right: 40px;
    height: 110px;
    border-bottom: 1px solid #eee;
  }

  .list-box .left {
    font-size: 32px;
    color: #333333;
    height: 109px;
    line-height: 109px;
  }

  .list-box .right span {
    font-size: 28px;
    color: #999999;
    margin-top: 38px;
  }

  .list-box .right .icon-right {
    width: 14px;
    margin-top: 43px;
    margin-left: 29px;
  }

  .upload img {
    width: 72px;
    height: 72px;
    margin-top: 19px;
  }

  .f-right {
    float: right;
  }

  .hint {
    font-size: 26px;
    color: #999999;
    line-height: 38px;
    margin-top: 30px;
    padding: 0 40px;
    text-align: justify;
  }

  .common-btn {
    margin-top: 80px;
    margin-left: 40px;
  }

  /*弹框样式*/
  .mint-popup {
    width: 100%;
    background-color: transparent;
    height: 100vh;
  }

  .popup-main {
    width: 82.7%;
    height: 73.5vh;

    background-color: #fff;
    margin: 0 auto;
    margin-top: 15%;
  }

  .popup-main img {
    width: 100%;
    height: 100%;
  }

  .close-popup {
    display: block;
    width: 88px;
    margin: 0 auto;
    margin-top: 45px;
  }

  .btn-box {
    padding-right: 40px;
  }

  .common-btn {
    width: 316px !important;
  }

  .grey-btn {
    background-color: #666666 !important;
  }

</style>
