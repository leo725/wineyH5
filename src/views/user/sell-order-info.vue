<template>
<div class="container">
  <common-title title="订单信息" fontsColor='#fff' class="setting-title"></common-title>
  <div class="list">
    <div class="list-top clearfix">
      <h5 v-if="orderInfo.state=='unpaid'">等待买家付款</h5>
      <h5 v-if="orderInfo.state=='paid'||orderInfo.state=='isPaid'">等待发货</h5>
      <h5 v-if="orderInfo.state=='send'">等待买家收货</h5>
      <h5 v-if="orderInfo.state=='finish'">买家已签收</h5>
    </div>
    <div class="list-bottom">
      <ul class="goodsList">
        <li class="clearfix">
          <router-link to="">
            <div class="imgBox">
              <img :src="orderInfo.logo">
            </div>
            <div class="infoBox">
              <div class="top">
                <div class="left-top">
                  <p>{{orderInfo.goodsName|substr(15)}}</p>
                </div>
                <div class="right-top">{{orderInfo.currencyName}}</div>
              </div>
              <div class="bottom">
                <div class="left-bottom">兑换数量 X{{orderInfo.goodsNumber}}</div>
              </div>
            </div>
          </router-link>
        </li>
      </ul>
      <div class="priceBox">
        <ul>
          <li>
            <div class="left">价格</div>
            <div class="right">
              <span>{{orderInfo.price}} {{orderInfo.currencyName}}</span>
            </div>
          </li>
          <li>
            <div class="left">运费</div>
            <div class="right">
              <span>Wcoin {{orderInfo.logisticsPrice}}</span>
            </div>
          </li>
          <li>
            <div class="left">合计</div>
            <div class="right">
              <span>Wcoin {{orderInfo.total}}</span>
            </div>
          </li>
        </ul>
        <div class="priceBottom">
          <p><span>买家:</span> {{orderInfo.nickName}}</p>
          <p><span>订单编号:</span> {{orderInfo.orderNo}}</p>
          <p><span>交易时间:</span> {{orderInfo.createTime}}</p>
        </div>
      </div>
      <div class="div-btn between" v-if="orderInfo.state!='finish'">
        <div class="btn" v-if="orderInfo.state=='confirm'" @click="gotoMailInfo">填写寄件信息</div>
        <div class="btn" v-if="orderInfo.state=='paid'" @click="gotoShipments">去发货</div>
      </div>
    </div>
  </div>
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
      text: '待收货',
      goodsWineryOrderId: this.$route.query.id,
      orderId: 0, //订单id
      orderInfo: {}
    }
  },
  created() {
    this.getDetail();
  },
  mounted() {

  },
  beforeDestroy() {
    // 页面销毁之前关闭弹窗
    this.$messagebox.close();
  },
  methods: {
    // 获取订单详情
    getDetail() {
      var params = {
        goodsWineryOrderId: this.goodsWineryOrderId
      }
      this.$http.post('/apis' + '/goods_winery_order/order_info.htm', this.Qs.stringify(params)).then(res => {
        if (res.retCode == 0) {
          this.orderInfo = res.data;
        } else if (res.retCode == "10002") {
          this.$router.replace({
            path: '/wcoin/login'
          })
        }
      })
    },
    // 填写寄件信息
    gotoMailInfo() {
      this.$router.replace({
        path: "/wcoin/mailInfo",
        query: {
          id: this.orderInfo.goodsWineryOrderId
        }
      })
    },
    // 去发货
    gotoShipments() {
      sessionStorage.removeItem('shipmentsParams');
      this.$router.replace({
        path: "/wcoin/shipments",
        query: {
          id: this.orderInfo.goodsWineryOrderId
        }
      })
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

.list {
  width: 690px;
  margin: 0 auto;
  margin-top: -20px;
  margin-bottom: 160px;
}

.list-top {
  padding-top: 55px;
  height: 200px;
  width: 100%;
  background: url(../../assets/img/line_z.png) no-repeat;
  background-size: 100% 221px;
  border-bottom: 4px dashed #FF0000;
}

.list-top h5 {
  font-size: 38px;
  color: #E50026;
  text-align: center;
  margin-top: 28px;
}

.list-bottom {
  min-height: 300px;
  background-color: #fff;
  width: 100%;
}

.goodsList {
  width: 650px;
  margin: 0 auto;
  padding-top: 30px;
}

.goodsList li {
  background-color: #FAFAF9;
  padding: 20px;
  margin-bottom: 30px;
}

.goodsList li a {
  display: block;
}

.imgBox {
  float: left;
}

.imgBox img {
  width: 150px;
  height: 150px;
}

.infoBox {
  float: left;
  margin-left: 20px;
  width: 438px;
}

.infoBox .top,
.infoBox .bottom {
  display: flex;
  justify-content: space-between;
}

.infoBox .bottom {
  margin-top: 30px;
}

.left-top p {
  width: 310px;
  font-size: 30px;
  color: #333333;
  line-height: 40px;
  height: 76px;
}

.right-top {
  font-size: 24px;
  color: #151515;
}

.left-bottom {
  font-size: 26px;
  color: #999999;
  margin-top: 6px;
}

.priceBox {
  padding: 0 60px;
  margin-top: 30px;
}

.priceBox ul {}

.priceBox li {
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
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
  padding-bottom: 60px;
  padding-top: 5px;
}

.priceBottom p {
  margin-top: 15px;
  font-size: 28px;
  color: #CCCCCC;
}
.priceBottom span{
  font-size: 28px;
}
/*.priceBottom p span{
  min-width: 120px;
  display: inline-block;
  text-align: right;
}*/
.div-btn {
  margin: 0 auto;
  margin-top: -20px;
  width: 607px;
  padding-bottom: 35px;
}

.div-btn .btn {
  background: #E50026;
  width: 288px;
  height: 88px;
  line-height: 88px;
  text-align: center;
  color: #fff;
  font-size: 32px;
}
</style>
