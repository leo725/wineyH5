<template>
<div class="container">
  <common-title :title="dataInfo.state=='send'?'待收货':dataInfo.state=='paid'?'待发货':dataInfo.state=='finish'?'已收货':'待发货'" fontsColor='#fff' class="setting-title"></common-title>
  <div class="list">
    <div class="list-top clearfix">
      <div class="left">
        <img src="../../assets/img/local-2.png">
      </div>
      <div class="right">
        <h5><span class="name">{{dataInfo.nickName}}</span><span>{{dataInfo.phone}}</span></h5>
        <p>{{dataInfo.address|substr(30)}}</p>
      </div>
    </div>
    <div class="list-bottom">
      <ul class="goodsList">
        <li class="clearfix">
          <router-link to="">
            <div class="imgBox">
              <img :src="dataInfo.logo">
            </div>
            <div class="infoBox">
              <div class="top">
                <div class="left-top">
                  <p>{{dataInfo.goodsName|substr(15)}}</p>
                </div>
                <div class="right-top"></div>
              </div>
              <div class="bottom">
                <div class="left-bottom">{{dataInfo.currencyName}}</div>
                <div class="right-bottom">X {{dataInfo.goodsNumber}}个</div>
              </div>
            </div>
          </router-link>
        </li>
      </ul>
      <div class="priceBox">
        <ul>
          <!-- <li>
              <div class="left">商品金额</div>
              <div class="right right-del">
                <span>Wcoin {{dataInfo.price}}</span>
              </div>
            </li> -->
          <li>
            <div class="left">运费</div>
            <div class="right">
              <span>Wcoin {{dataInfo.logisticsPrice}}</span>
            </div>
          </li>
          <li>
            <div class="left">运费险</div>
            <div class="right">
              <span>Wcoin {{dataInfo.logisticsSafePrice}}</span>
            </div>
          </li>
          <li>
            <div class="left">实付金额</div>
            <div class="right right-red">
              <span>Wcoin {{dataInfo.total}}</span>
            </div>
          </li>
        </ul>
        <div class="priceBottom">
          <p>订单编号: {{dataInfo.orderNo}}</p>
          <p>交易时间: {{dataInfo.createTime}}</p>
        </div>
      </div>
    </div>
  </div>
  <div class="footer" v-if="dataInfo.state=='send'">
    <div class="btn">
      <a :href="'tel:'+dataInfo.releaseMobileNo">联系卖家</a>
    </div>
    <div class="btn">
      <router-link :to="{ path: '/wcoin/logistics', query: {logisticsCode:dataInfo.logisticsCode,logisticsNumber:dataInfo.logisticsNumber} }">查看物流</router-link>
    </div>
    <div class="btn sureBtn" @click="takeOver">
      <a href="javascript:;">确认收货</a>
    </div>
  </div>
  <div class="footer" v-if="dataInfo.state=='paid' || dataInfo.state=='confirm'">
    <div class="btn">
      <a :href="'tel:'+dataInfo.releaseMobileNo">联系卖家</a>
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
      text: '无',
      orderId: 0, //订单id
      dataInfo: {}
    }
  },
  mounted() {

  },
  created() {
    this.getOrderInfo();
  },
  beforeDestroy() {
    // 页面销毁之前关闭弹窗
    this.$messagebox.close();
  },
  methods: {
    //确认收货
    takeOver() {
      this.$messagebox.confirm('', {
        title: '提示',
        message: '是否确认收货?',
      }).then(action => {
        if (action == 'confirm') { //确认的回调
          var params = {
            goodsWineryOrderId: this.$route.query.id
          }
          this.$http.post('/apis' + '/goods_winery_order/update.htm', this.Qs.stringify(params)).then(res => {
            if (res.retCode == 0) {
              this.getOrderInfo();
            } else if (res.retCode == "10002") {
              this.$router.replace({
                path: '/wcoin/login'
              })
            }
          })
        }
      }).catch(err => {
        if (err == 'cancel') { //取消的回调
          console.log(2);
        }
      });
    },
    //获取订单详情数据
    getOrderInfo() {
      var params = {
        goodsWineryOrderId: this.$route.query.id
      }
      this.$http.post('/apis' + '/goods_winery_order/order_info.htm', this.Qs.stringify(params)).then(res => {
        if (res.retCode == 0) {
          this.dataInfo = res.data;
          sessionStorage.setItem('orderInfo', JSON.stringify(this.dataInfo));
          console.log(res)
        } else if (res.retCode == "10002") {
          this.$router.replace({
            path: '/wcoin/login'
          })
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
  margin-bottom: 160px;
}

.list-top {
  padding-top: 55px;
  height: 221px;
  width: 100%;
  background: url(../../assets/img/line_z.png) no-repeat;
  background-size: 100% 221px;
  border-bottom: 4px dashed #FF0000;
}

.list-top .left {
  float: left;
  padding: 0 40px;
  margin-top: 40px;
}

.list-top .left img {
  width: 23.5px;
}

.list-top .right h5 {}

.list-top .right p {
  font-size: 28px;
  color: #999999;
  line-height: 38px;
  margin-top: 10px;
}

.list-top .right span {
  font-size: 32px;
  color: #333333;
}

.list-top .right .name {
  padding-right: 25px;
}

.list-top .right {
  float: left;
  width: 550px;
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
  min-height: 82px;
}

.right-top {
  font-size: 30px;
  color: #151515;
}

.left-bottom {
  font-size: 28px;
  color: #151515;
  margin-top: 3px;
}

.right-bottom {
  font-size: 22px;
  color: #666666;
  padding: 6px 12px;
  background-color: #EFEEEC;
}

.right-bottom span {}

.priceBox {
  padding: 0 60px;
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
  padding-bottom: 30px;
  padding-top: 5px;
}

.priceBottom p {
  margin-top: 15px;
  font-size: 28px;
  color: #CCCCCC;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #fff;
  height: 120px;
  border-top: 2px solid #FAFAF9;
  display: flex;
  width: 100%;
  justify-content: flex-end;
}

.footer .btn {
  margin-top: 19px;
  margin-right: 20px;
}

.footer .btn a {
  display: block;
  border: 2px solid #666666;
  font-size: 32px;
  color: #666666;
  width: 200px;
  height: 80px;
  text-align: center;
  line-height: 76px;
}

.footer .sureBtn a {
  border-color: #E50026;
  color: #E50026;
}
</style>
