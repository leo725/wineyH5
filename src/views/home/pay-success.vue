<template>
  <div class="container">
    <common-title title="购买结果" fontsColor='#000' class="setting-title"></common-title>
    <div class="list">
      <div class="line_caries"></div>
      <div class="list-top clearfix">
        <img src="../../assets/img/right.png">
        <p>支付成功</p>
      </div>
      <div class="list-bottom">
        <div class="priceBox">
          <ul>
            <li>
              <div class="left">交易金额</div>
              <div class="right ">
                <span>{{list.wineryPrice*list.proportion}} Wcoin</span>
              </div>
            </li>
            <li>
              <div class="left">商品名称</div>
              <div class="right">
                <span>{{list.goodsName}}</span>
              </div>
            </li>
            <li>
              <div class="left">交易数量</div>
              <div class="right">
                <span>{{list.wineryPrice}}个</span>
              </div>
            </li>
          </ul>
          <div class="priceBottom">
            <p>订单编号: {{list.orderNo}}</p>
            <p>订单时间: {{list.createTime|changeTime('-')}}</p>
          </div>
          <div class="footer">
            <div class="btn">
              <router-link to="/wcoin/home">
                继续逛逛
              </router-link>
            </div>
            <div class="btn convertBtn">
              <router-link to="/wcoin/myWine">
                兑换红酒
              </router-link>
            </div>
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
      text: '待收货',
      orderId: 0, //订单id
      list:[]
    }
  },
  mounted() {

  },
  created() {
    this.list=JSON.parse(sessionStorage.getItem("orderData"));
    console.log(this.list)
  },
  methods: {}

}

</script>
<style scoped>
.container {
  min-height: 100%;
  background-color: #F3F2F0;
  width: 100%;
  overflow: auto;
  
}
.list {
  width: 690px;
  margin: 0 auto;
  margin-top: -20px;
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
  padding-bottom: 60px;
}
.list-top img {
  width: 168px;
}
.list-top p {
  margin-top: 16px;
  text-align: center;
  font-size: 38px;
  color: #E50026;
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
  border-top: 2px solid #D9D9D9;
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
  border-top: 2px solid #D9D9D9;
  padding-bottom: 30px;
  padding-top: 15px;
}
.priceBottom p {
  margin-top: 15px;
  font-size: 28px;
  color: #CCCCCC;
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
  width: 280px;
  height: 88px;
  text-align: center;
  line-height: 88px;
  background-color: #999;
}
.footer .convertBtn a {
  background-color: #666;
}

</style>
