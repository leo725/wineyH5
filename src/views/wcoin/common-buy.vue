<template>
<div class="container">
  <common-title title="购买">
    <img src="../../assets/img/icon-list.png" class="link-img" slot @click="targetPage">
  </common-title>
  <div class="list-box">
    <div class="list between">
      <input type="text" v-model="numbers" @input="handleInput" maxlength="20" name="" :placeholder="'可购买数量'+surplusNumber"><span @click="numbers=surplusNumber">全部买入</span>
    </div>
    <div class="list between">
      <span>{{price}}EUR</span><span></span>
    </div>
  </div>
  <div class="common-btn" @click="suerBuy">确认购买</div>
  <!--确认订单弹框-->
  <div class="modelPop" v-show="keyShow" @click="keyShow=false;"></div>
  <div class="alert-model parameter-model" v-if="keyShow">
    <span class="close" @click="keyShow=false;">
            <img src="../../assets/img/alert-close.png">
          </span>
    <h3>订单</h3>
    <ul>
      <li>
        <div class="left">
          交易金额
        </div>
        <div class="right red">
          {{orderInfo.totalPrice.toFixed(2)}} EUR
        </div>
      </li>
      <li>
        <div class="left">
          单价
        </div>
        <div class="right">
          {{orderInfo.price.toFixed(2)}} EUR
        </div>
      </li>
      <li>
        <div class="left">
          数量
        </div>
        <div class="right">
          {{orderInfo.number}}
        </div>
      </li>
      <li>
        <div class="left">
          卖家
        </div>
        <div class="right">
          {{orderInfo.nickName}}
        </div>
      </li>
    </ul>
    <div class="data-view">
      <p>订单时间:{{orderInfo.createTime|dateAndTime}}</p>
      <p>订单编号:{{orderInfo.orderNo}}</p>
    </div>
    <div class="common-btn" @click="goBuy">
      去支付
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
      numbers: '',
      money: '',
      keyShow: false,
      surplusNumber: this.$route.query.surplusNumber,
      price: this.$route.query.price,
      id: this.$route.query.id,
      nickName: this.$route.query.nickName,
      orderInfo: {}
    }
  },
  created() {

  },
  methods: {
    handleInput(e) {
      this.numbers = e.target.value.replace(/[^.\d]/g, '');
      if (this.numbers > this.surplusNumber) {
        this.numbers = this.surplusNumber;
      }
    },
    suerBuy() {
      if (!this.numbers) {
        this.$toast({
          message: '请输入购买数量',
          className: 'warning',
          duration: 1200
        });
        return false;
      }
      if (parseFloat(this.numbers)<=0) {
        this.$toast({
          message: '购买数量不能为零',
          className: 'warning',
          duration: 1200
        });
        return false;
      }
      if (!this.globalData.hasRealInfo) {
        this.$http.post('/apis' + 'user_real/info.htm').then(res => {
          if (res.retCode == '0') {
            if (res.data.realAudit == 'agree') {
              console.log(res.data)
              this.globalData.hasRealInfo = true;
              this.createOrder();
            } else {
              this.$toast({
                message: '请先实名认证',
                duration: 1200,
                className: 'warning'
              });
              return false;
            }
          } else if (res.retCode == "10002") {
            this.$router.replace({
              path: '/wcoin/login'
            })
          }
        })
      }else{
        this.createOrder();
      }
    },
    createOrder(){
      var params = {
        userWcoinSellId: this.id,
        number: this.numbers
      }
      this.$http.post('/apis' + 'user_wcoin_order/create.htm', this.Qs.stringify(params)).then(res => {
        if (res.retCode == 0) {
          this.orderInfo = res.data;
          this.keyShow = true;
        } else if (res.retCode == "10002") {
          this.$router.replace({
            path: '/wcoin/login'
          })
        }
      })
    },
    //点击去支付
    goBuy() {
      sessionStorage.setItem('wcoinOrderInfo', JSON.stringify(this.orderInfo));
      this.$router.replace({
        path: '/wcoin/orderForm',
        query: {}
      })
    },
    targetPage() {
      sessionStorage.setItem("sortNav", 1); //赋值sessionStorage的sortNav值
      this.$router.push({
        path: '/wcoin/transaction'
      })
    }
  },

}
</script>
<style scoped>
.list-box {
  padding-left: 40px;
}

.list {
  border-bottom: 1px solid #eee;
  height: 110px;
  width: 100%;
  overflow: hidden;
}

.list input {
  font-size: 34px;
  color: #333;
  height: 108px;
  width: 500px;
}

.list span {
  font-size: 34px;
  color: #666;
  height: 110px;
  line-height: 110px;
  padding-right: 40px;
}

.link-img {
  width: 36px;
  margin-right: 40px;
  margin-top: 10px;
  height: 42px;
}

.btn-buy {
  width: 288px;
  height: 88px;
}

.common-btn {
  margin-left: 40px;
}

.modelPop {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  height: 100vh;
  z-index: 10;
}

.alert-model {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  height: 1000px;
  z-index: 20;
}

.close {
  position: absolute;
  top: 40px;
  right: 40px;
}

.close img {
  width: 70px;
}

.parameter-model h3 {
  font-size: 54px;
  color: #000000;
  padding-left: 40px;
  padding-top: 40px;
  padding-bottom: 50px;
}

.parameter-model ul {
  padding-left: 60px;
}

.parameter-model ul li {
  border-bottom: 1px solid #eee;
  height: 110px;
  display: flex;
  justify-content: space-between;
}

.parameter-model .left {
  font-size: 32px;
  color: #000;
  height: 109px;
  line-height: 109px;
}

.parameter-model .right {
  font-size: 32px;
  color: #999;
  padding-right: 50px;
  height: 109px;
  line-height: 109px;
}

.parameter-model .red {
  font-size: 38px;
  color: #E50026;
}

.data-view {
  margin-top: 50px;
  padding-left: 60px;
}

.data-view p {
  font-size: 28px;
  color: #ccc;
  margin-bottom: 16px;
}

.common-btn {
  margin-top: 96px;
  margin-left: 60px;
}
</style>
