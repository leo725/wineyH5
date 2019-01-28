<template>
<div class="container">
  <common-title title="订单结果"></common-title>
  <div class="list-box">
    <div class="list list-one">
      <img src="../../assets/img/icon-ok.png">
      <span v-if="type==1">购买申请已提交</span>
      <span v-else>卖出申请已提交，等待成交</span>
    </div>
    <div class="lines" v-if="type==1">
      <p>{{orderInfo.totalPrice}} EUR</p>
      <p>Wcoin {{orderInfo.number}}个</p>
    </div>
    <div class="lines" v-else>
      <p>Wcoin {{orderInfo.number}}个</p>
      <p>{{orderInfo.bankName+'('+orderInfo.cardNo+')'}}</p>
    </div>
    <div class="list list-one">
      <img src="../../assets/img/icon-dash.png">
      <span v-if="type==1">交易成功</span>
      <span v-else>银行卡到账，成交确认</span>
    </div>
    <div class="link" @click="targetPage">
      <div class="left">
        <span v-if="type==1"> 查看购买记录</span>
        <span v-else>查看出售记录</span>
      </div>
      <div class="right">
        <img src="../../assets/img/icon-right.png">
      </div>
    </div>
    <div class="common-btn" @click="sureBtn">完成</div>
  </div>
</div>
</template>
<script>
import commonTitle from '@/components/common-title'
export default {
  data() {
    return {
      type: this.$route.query.type,
      orderInfo: {
        number: this.$route.query.number,
        bankName: this.$route.query.bankName,
        cardNo: this.$route.query.cardNo,
        totalPrice: this.$route.query.totalPrice
      }
    }
  },
  components: {
    commonTitle
  },
  created() {

  },
  methods: {
    sureBtn() {
      this.$router.replace({
        path: '/wcoin/wcoin'
      })
    },
    targetPage() {
      sessionStorage.setItem("sortNav", this.$route.query.type); //赋值sessionStorage的sortNav值
      this.$router.push({
        path: '/wcoin/transaction'
      })
    }
  }
}
</script>
<style scoped>
.list-box {
  padding-left: 40px;
  margin-top: 30px;
}

.lines {
  border-left: 3px dashed #9A9791;
  height: 155px;
  padding-top: 20px;
  margin-left: 30px;
  padding-left: 55px;
}

.lines p {
  font-size: 32px;
  color: #CCCCCC;
  margin-bottom: 10px;
}

.list img {
  width: 60px;
  vertical-align: middle;
  margin-right: 10px;
}

.list span {
  vertical-align: middle;
  font-size: 36px;
  color: #333333;
}

.link {
  margin-top: 175px;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  padding-right: 40px;
}

.link img {
  width: 13.3px;
  margin-top: 42px;
}

.link span {
  font-size: 30px;
  color: #666666;
  height: 110px;
  line-height: 110px;
  display: block;
}
</style>
