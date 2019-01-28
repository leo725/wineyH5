<template>
<div class="container" :class="detailObj.auditState=='refuse'?'bmg-h':''">
  <common-title :title="text" fontsColor='#fff' class="setting-title"></common-title>
  <div class="list">
    <div class="line_caries"></div>
    <div class="list-top clearfix">
      <img v-if="detailObj.auditState=='agree'||detailObj.orderState=='success'" src="../../assets/img/right.png">
      <p v-if="detailObj.auditState!='agree'&&detailObj.orderState!='success'">{{detailObj.totalMoney}} EUR</p>
    </div>
    <div class="list-bottom">
      <div class="priceBox">
        <ul>
          <li>
            <div class="left">交易金额</div>
            <div class="right red">
              <span v-if="state!=2">{{detailObj.totalMoney}} EUR</span>
              <span v-if="state==2">{{detailObj.sysPrice}} Wcoin</span>
            </div>
          </li>
          <li v-if="state==1">
            <div class="left">单价</div>
            <div class="right">
              <span>{{detailObj.price}} EUR</span>
            </div>
          </li>
          <li v-else>
            <div class="left">商品名称</div>
            <div class="right">
              <span>{{detailObj.currencyName}}</span>
            </div>
          </li>
          <li>
            <div class="left">数量</div>
            <div class="right">
              <span v-if="state!=2">{{detailObj.currencyNumber}}个</span>
              <span v-else>{{detailObj.wineryPrice}}个</span>
            </div>
          </li>
        </ul>
        <div class="priceBottom" :class="detailObj.auditState=='notreal'||detailObj.auditState=='wait'?'noborder':''">
          <p v-if="state==2">买家昵称: {{detailObj.nickName}}</p>
          <p>订单编号: {{detailObj.orderNo}}</p>
          <p>交易时间: {{detailObj.createTime|dateAndTime}}</p>
        </div>
        <div v-if="detailObj.auditState=='notreal'||detailObj.auditState=='wait'">
          <div class="link between" @click="orderPopup=true">
            <span>查看买家支付凭证</span>
            <img src="../../assets/img/icon-right.png">
          </div>
          <div class="footer">
            <div class="btn" @click="takeOver">
              <a href="javascript:;">放行</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <mt-popup v-model="orderPopup" popup-transition="popup-fade" position="bottom">
    <div class="popup-main popup-main-max">
      <img :src="'http://apppay.oss-cn-hangzhou.aliyuncs.com/'+detailObj.payVoucher">
    </div>
    <img src="../../assets/img/pay-close.png" class="close-popup" @click="orderPopup=false">
  </mt-popup>
</div>
</template>
<script>
import commonTitle from '@/components/common-title';
export default {
  components: {
    commonTitle
  },
  data() {
    return {
      text: '待确认',
      orderId: 0, //订单id
      type: 'finish',
      state: this.$route.query.state, //1为出售，2为卖出
      detailObj: {},
      orderPopup: false
    }
  },
  mounted() {

  },
  created() {
    this.detailObj = JSON.parse(sessionStorage.getItem('transactionDetail'));
    console.log(this.detailObj)
    if (this.state == 2) {
      this.text = this.detailObj.orderState == 'success' ? "出售成功" : '交易失败';
    } else {
      this.text = this.detailObj.auditState == 'notreal' ? "待买家付款" : this.detailObj.auditState == 'wait' ? '待确认' : this.detailObj.auditState == 'agree' ? '出售成功' : '已取消'
    }
  },
  beforeDestroy() {
    // 页面销毁之前关闭弹窗
    this.$messagebox.close();
  },
  methods: {
    //确认放行
    takeOver() {
      this.$messagebox.confirm('', {
        title: '确认放行？',
        message: '放行前请确认您已收到出售款项，如未收到请点击取消。',
      }).then(action => {
        if (action == 'confirm') { //确认的回调
          var params = {
            id: this.detailObj.id
          }
          this.$http.post('/apis' + 'user_wcoin_order/release.htm', this.Qs.stringify(params)).then(res => {
            if (res.retCode == 0) {
              this.$toast({
                message: '放行成功',
                duration: 1200,
                className: 'success'
              });
              this.detailObj.auditState = 'agree';
              this.text = '出售成功';
              sessionStorage.setItem('transactionDetail', JSON.stringify(this.detailObj))
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
  }

}
</script>
<style scoped>
.container {
  min-height: 100%;
  background-color: #FF0000;
  width: 100%;
  overflow: auto;
  
}

.bmg-h {
  background-color: #323534;
}

.list {
  width: 690px;
  margin: 0 auto;
  margin-bottom: 120px;
}

.line_caries {
  height: 15px;
  background: url(../../assets/img/line_caries.png) no-repeat;
  width: 100%;
  background-size: 100% 100%;
}

.list-top {
  padding-top: 70px;
  width: 100%;
  background-color: #fff;
  text-align: center;
  padding-bottom: 20px;
}

.list-top img {
  width: 168px;
}

.list-top p {
  margin-top: 16px;
  text-align: center;
  font-size: 54px;
  color: #333333;
  margin-bottom: 40px;
}

.list-bottom {
  min-height: 300px;
  background-color: #fff;
  width: 100%;
}

.priceBox {
  padding: 0 60px;
}

.priceBox ul {
  padding-top: 30px;
}

.priceBox li {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.priceBox .left {
  font-size: 30px;
  color: #666;
}

.priceBox .right span {
  font-size: 30px;
  color: #333333;
}

.priceBox .red span {
  color: #E50026;
  font-size: 32px;
}

.right-del span::after {
  content: "";
  width: 100%;
  height: 2px;
  background-color: #666;
  display: block;
  position: relative;
  top: -15px;
}

.priceBox .right-red span {
  color: #E50026;
}

.priceBottom {
  padding-bottom: 30px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.noborder {
  border: none;
}

.priceBottom p {
  margin-top: 15px;
  font-size: 28px;
  color: #CCCCCC;
}

.link {
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.link span {
  font-size: 30px;
  color: #666666;
  display: block;
  height: 110px;
  line-height: 110px;
}

.link img {
  height: 25.2px;
  margin-top: 41px;
}

.footer {
  margin-top: 30px;
  background-color: #fff;
  display: flex;
  width: 570px;
  justify-content: space-between;
  padding-bottom: 50px;
}

.footer .btn {
  margin-top: 19px;
  margin-right: 20px;
}

.footer .btn a {
  display: block;
  font-size: 32px;
  color: #fff;
  width: 570px;
  height: 88px;
  text-align: center;
  line-height: 88px;
  background-color: #333;
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
</style>
