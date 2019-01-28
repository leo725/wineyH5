<template>
  <div class="container">
    <common-title :title="text" fontsColor='#fff' class="setting-title"></common-title>
    <div class="list">
      <div class="line_caries"></div>
      <div class="list-top clearfix">
        <img  src="../../assets/img/right.png">
      </div>
      <div class="list-bottom">
        <div class="priceBox">
          <ul>
            <li>
              <div class="left">交易金额</div>
              <div class="right red">
                <span>{{detailObj.sysPrice}} Wcoin</span>
              </div>
            </li>
            <li>
              <div class="left">商品名称</div>
              <div class="right">
                <span>{{detailObj.currencyName}}</span>
              </div>
            </li>
            <li>
              <div class="left">数量</div>
              <div class="right">
                <span>{{detailObj.wineryPrice}}个</span>
              </div>
            </li>
          </ul>
          <div class="priceBottom">
            <p>订单编号: {{detailObj.orderNo}}</p>
            <p>交易时间: {{detailObj.createTime|dateAndTime}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import commonTitle from '@/components/common-title';
export default {
  components: { commonTitle },
  data() {
    return {
      text: '购买成功',
      detailObj:{}
    }
  },
  mounted() {

  },
  created() {
    this.detailObj = JSON.parse(sessionStorage.getItem('transactionDetail'));
  },
  methods: {

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
.noborder{
  border: none;
}
.priceBottom p {
  margin-top: 15px;
  font-size: 28px;
  color: #CCCCCC;
}
</style>
