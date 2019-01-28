<template>
  <div class="container">
    <common-title title="物流信息"></common-title>
    <div class="goods-box clearfix">
      <img :src="orderInfo.logo">
      <div class="goods-r">
        <h3>已发货</h3>
        <p><span>{{express}} {{orderInfo.logisticsNumber}}</span></p>
      </div>
    </div>
    <div class="list-box">
      <div class="list-top clearfix">
        <img src="../../assets/img/Delivery-address.png">
        <span>[收件地址]{{orderInfo.address}}</span>
      </div>
      <ul class="list-foot">
        <li class="clearfix" v-for="item in dataInfo">
          <div class="left">
            <h6>{{item.time|timeStyle('-','onlyMd','str')}}</h6>
            <p>{{item.time|timeStyle('-','onlyHm','str')}}</p>
          </div>
          <div class="right">
            <i></i>
            <h5>{{item.context}}</h5>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import commonTitle from '@/components/common-title'
export default {
  data() {
    return {
      orderInfo: JSON.parse(sessionStorage.getItem("orderInfo")),
      dataInfo: [],
      express: '暂无数据' //接收快递code
    }
  },
  components: { commonTitle },
  created() {
    this.getInfo();
  },
  methods: {
    //获取订单详情数据
    getInfo() {
      var params = {
        logisticsCode: this.$route.query.logisticsCode,
        logisticsNumber: this.$route.query.logisticsNumber,
      }
      this.$http.post('/apis' + '/goods_winery_order/getLogistics.htm', this.Qs.stringify(params)).then(res => {
        if (res.retCode == 0) {
          if (res.data.status == '200') {
            this.dataInfo = res.data.data
            this.getCompany();
          } else {
            this.$toast({
              message: "物流数据异常，请稍后再试",
              duration: 1200,
              className: 'error'
            });
          }
        } else if (res.retCode == "10002") {
          this.$router.replace({ path: '/wcoin/login' })
        }
      })
    },
    //解析快递公司
    getCompany() {
      this.$http.post('/apis' + '/sell_order/data.htm', this.Qs.stringify({})).then(res => {
        if (res.retCode == 0) {

          var data = res.data;
          for (var i = 0; i < data.length; i++) {
            if (data[i].logisticsCode == this.$route.query.logisticsCode) {
              this.express = res.data[i].logisticsCompayName;
              return false;
            }

          }

        } else if (res.retCode == "10002") {
          this.$router.replace({ path: '/wcoin/login' })
        }
      })
    }
  }
}

</script>
<style scoped>
.goods-box {
  background-color: #F2F2F2;
  width: 670px;
  margin: 0 auto;
  height: 188px;
  overflow: hidden;
}

.goods-box img {
  width: 188px;
  height: 188px;
  float: left;
}

.goods-r {
  float: left;
  margin-left: 30px;
}

.goods-r span {
  font-size: 25px;
  color: #999999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.goods-r p {
  margin-top: 12px;
  width: 420px;
}

.goods-r h3 {
  font-size: 38px;
  color: #333333;
  margin-top: 52px;
}

.list-box {}

.list-top {
  padding-left: 160px;
  padding-right: 40px;
  margin-top: 50px;
}

.list-top img {
  width: 44px;
  float: left;
}

.list-top span {
  float: left;
  margin-left: 37px;
  display: block;
  width: 458px;
  font-size: 28px;
  color: #666666;
  line-height: 42px;
  text-align: justify;
}

.list-foot {
  padding-top: 40px;
}

.list-foot li {}

.list-foot .left {
  padding-left: 60px;
  float: left;
  width: 183px;
}

.list-foot .left h6 {
  font-size: 28px;
  color: #666666;
}

.list-foot .left p {
  font-size: 24px;
  color: #999999;
}

.list-foot .right {
  float: left;
  position: relative;
  border-left: 1px solid #ccc;
  padding-top: 10px;
  padding-bottom: 40px;
}

.list-foot .right i {
  position: absolute;
  top: 0;
  left: -14.6px;
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ccc;
  border: 10px solid #fff;
  box-sizing: initial;
  -moz-box-sizing: initial;
  -webkit-box-sizing: initial;
}

.list-foot li:first-child .right i {
  width: 44px;
  height: 44px;
  background: url(../../assets/img/sign-in.png) no-repeat #fff;
  background-size: 100%;
  top: -10px;
  left: -32px;
}

.list-foot li:last-child .right {
  border: none;
}

.list-foot .right h5 {
  margin-left: 58px;
  width: 458px;
  text-align: justify;
  font-size: 28px;
  color: #666666;
  line-height: 42px;
  margin-top: -10px;
}

</style>
