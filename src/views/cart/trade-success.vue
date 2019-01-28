<template>
  <div class="container">
    <common-title title="购买结果" fontsColor='#000' class="setting-title"></common-title>
    <div class="list">
      <div class="line_caries"></div>
      <div class="list-top clearfix">
        <img src="../../assets/img/right.png">
        <p>{{successObj.title}}支付成功</p>
      </div>
      <div class="list-bottom">
        <div class="priceBox" v-for="item in successObj.apiUserShopingCartListVo">
          <ul>
            <li>
              <div class="left">交易金额</div>
              <div class="right ">
                <span>{{item.price}}</span>
              </div>
            </li>
            <li>
              <div class="left">商品名称</div>
              <div class="right">
                <span>{{item.currencyName}}</span>
              </div>
            </li>
            <li>
              <div class="left">交易数量</div>
              <div class="right">
                <span>{{item.number}}个</span>
              </div>
            </li>
          </ul>
          <div class="priceBottom">
            <p>订单编号: {{item.orderNo}}</p>
            <p>订单时间: {{item.createTime|dateAndTime}}</p>
          </div>
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
</template>
<script>
import commonTitle from '@/components/common-title';
export default {
  components: { commonTitle },
  data() {
    return {
      text: '待收货',
      orderId: 0, //订单id
      successObj:{}
    }
  },
  mounted() {

  },
  created() {
    var cartTradeSuccess=sessionStorage.getItem('cartTradeSuccess');
    if(cartTradeSuccess){
      this.successObj=JSON.parse(cartTradeSuccess)
    }
  },
  methods: {}

}

</script>
<style scoped>
.container {
  background-color: #F3F2F0;
  width: 100%;
  overflow: scroll;
  height: 100%;
  position: relative;
  z-index: 1;
  -webkit-overflow-scrolling:touch;
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
  padding-bottom: 35px;
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
  margin-bottom: 200px;
  padding-bottom: 20px;
}

.priceBox {
  background: #F2F2F2;
  width: 630px;
  margin: 0 auto;
  padding: 0 30px;
  margin-bottom: 40px;
}

.priceBox ul {
  padding: 0 10px;
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
  justify-content: space-between;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 148px;
  padding: 0 30px;
}

.footer .btn {
  margin-top: 30px;
}

.footer .btn a {
  display: block;
  font-size: 32px;
  color: #fff;
  width: 330px;
  height: 88px;
  text-align: center;
  line-height: 88px;
  background-color: #999;
}

.footer .convertBtn a {
  background-color: #666;
}

</style>
