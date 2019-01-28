<template>
<div class="container">
  <common-title title="填写订单" fontsColor="#333"></common-title>
  <div class="boxs">
    <div class="headline">收货地址</div>
    <div class="addressBox between" @click="targetInfo">
      <div class="left">
        <h5><span>{{goodsInfo.nickName}}</span><span>{{goodsInfo.phone}}</span></h5>
        <p>{{goodsInfo.provinceName}}{{goodsInfo.cityName}}{{goodsInfo.areaName}}{{goodsInfo.address}}</p>
      </div>
      <div class="right">
        <img src="../../assets/img/icon-right.png">
      </div>
    </div>
    <div class="headline">红酒兑换</div>
    <div class="goodsList">
      <ul>
        <li class="clearfix">
          <div class="left">
            <img :src="goodsInfo.logo">
          </div>
          <div class="right between">
            <div class="info-left">
              <h4>{{goodsInfo.goodsName}}</h4>
              <p>{{goodsInfo.currencyName}}</p>
            </div>
            <div class="info-right">
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="data-list">
      <ul>
        <li class="between">
          <div class="left">
            <span>兑换数量</span>
          </div>
          <div class="right">
            <i class="btn minus" @click="numbers=numbers==1?1:numbers-1"></i>
            <input type="text" @click="numberAlertShow=true" readonly="readonly" name="" v-model="numbers">
            <i class="btn add" @click="numbers=numbers+1"></i>
          </div>
        </li>
        <li class="between">
          <div class="left">
            <span>运费</span>
          </div>
          <div class="right">
            {{this.state=='VISA'?'EUR':this.state}} {{goodsInfo.logisticsPrice}}
          </div>
        </li>
        <li class="between">
          <div class="left">
            <span>运费险</span>
            <input type="checkbox" :checked="checkbox" @click="check" class="common-checkbox" name="">
          </div>
          <div class="right">
            {{this.state=='VISA'?'EUR':this.state}} {{goodsInfo.logisticsSafePrice}}
          </div>
        </li>
      </ul>
      <div class="word-link">
        <router-link to="">
          <img src="../../assets/img/icon-info.png">
          <span>运费险投保须知</span>
        </router-link>
      </div>
      <div class="pay-type between" @click="popupVisible=true">
        <div class="pay-left">
          支付方式
        </div>
        <div class="pay-right">
          <img src="../../assets/img/icon-right.png">
        </div>
      </div>
    </div>
    <div class="footer-div">
      <div class="prive-info">
        <span>支付: </span><span class="red">{{goodsInfo.total}} {{this.state=='VISA'?'EUR':this.state}}</span>
      </div>
      <div class="btn" @click="suerBtn">去支付</div>
    </div>
  </div>
  <!-- 选择币种 -->
  <!-- <mt-popup v-model="popupVisible" popup-transition="popup-fade" position="bottom"> -->
    <div class="alert-box" v-if="popupVisible" @click="popupVisible=false">
      
    </div>
    <div class="popup-main" v-if="popupVisible">
      <p class="between pop-title">
        <span>请选择支付方式</span>
        <img src="../../assets/img/alert-close.png" alt="" class="close" @click="popupVisible=false">
      </p>
      <ul class="pop-list">
        <li @click="getInfo('platform')">
          <span class="name">Wcoin</span>
          <img src="../../assets/img/icon-select.png" v-if="state=='Wcoin'" alt="" class="select">
        </li>
        <li @click="getInfo('party')">
          <span class="name">VISA</span>
          <img src="../../assets/img/icon-select.png" v-if="state=='VISA'" alt="" class="select">
        </li>
      </ul>
    </div>
  <!-- </mt-popup> -->
  <!-- VISA支付弹窗 -->
  <!-- <mt-popup v-model="visaShow" position="bottom"> -->
  <div class="alert-box" v-if="visaShow" @click.stop="visaShow=false;">
    <div class="visa-box between">
      <!-- env = sandbox | production ; -->
      <pay-pal :amount="goodsInfo.total+''" currency="EUR" :client="credentials" env="production" @payment-completed="paypalSuccess" @payment-authorized="paypalAuthorized" @payment-cancelled="paypalCancel"></pay-pal>
      <img src="../../assets/img/alert-close.png" class="close" alt="" @click="visaShow=false">
    </div>
  </div>
  <!-- </mt-popup> -->
  <numberAlert v-show="numberAlertShow" @sureBtn="sureFun" @closeBtn="closeFun" v-if="numberAlertHas" :num='numbers'></numberAlert>
  <keyboard @changeNum="submitOrder" v-show="keyShow" @closePwd="closekey"></keyboard>
</div>
</template>
<script>
import commonTitle from '@/components/common-title';
import numberAlert from '@/components/number-alert';
import keyboard from '@/components/keyboard'
import payPal from 'vue-paypal-checkout'
export default {
  components: {
    commonTitle,
    numberAlert,
    keyboard,
    payPal
  },
  data() {
    return {
      numbers: 2,
      popupVisible: false,
      numberAlertShow: false,
      goodsInfo: {},
      state: 'Wcoin',
      checkbox: false,
      orderObj: {},
      numberAlertHas: false,
      payType: 'platform',
      keyShow: false,
      visaShow: false,
      credentials: {
        sandbox: 'AZYKtVWQXctxdy3YdBGyKHCb8ZuaL6n2b6QY6CrzKjBClLOhCDbgVo0JbprbulcX0Y6DLDmG5TUCnkNo',
        production: 'AQLyDuKf8lz4xwmmKutZ8eT4bLymcb8-ZRIjVqh9yQ_TPDDb5lGOpJif2TNr4o5jsuKYVprNGvM-Eoq2'
      }
    }
  },
  mounted() {

  },
  created() {
    this.orderObj = JSON.parse(sessionStorage.getItem("orderObj"));
    if (!this.orderObj) { // null nan undefined
      this.numbers = parseInt(this.$route.query.num);
      this.orderObj = {}
    } else { // 存在
      if (this.orderObj.num) {
        this.numbers = this.orderObj.num
      }
      if (this.orderObj.checkbox) {
        this.checkbox = this.orderObj.checkbox
      }
      if (this.orderObj.payType) {
        this.payType = this.orderObj.payType
      }
    }

    this.numberAlertHas = true
    this.getInfo(this.payType);
  },
  methods: {
    handleInput(e) {
      this.numbers = e.target.value.replace(/[^\d]/g, '');
      this.numbers = this.numbers <= 0 ? 1 : this.numbers;
    },
    //获取填写订单的数据
    getInfo(type) {
      var params = {
        goodsId: this.$route.query.goodsId,
        num: this.numbers,
        payType: type
      }
      this.$http.post('/apis' + '/goods_winery_order/info.htm', this.Qs.stringify(params)).then(res => {
        if (res.retCode == 0) {
          this.goodsInfo = res.data;
          this.total();
          this.popupVisible = false;
          if (type == "platform") {
            this.state = "Wcoin"
          } else {
            this.state = "VISA"
          }
          this.orderObj.payType = type;
          this.payType = type
          // 获取选择的地址
          var selectedAddress = sessionStorage.getItem('selectedAddress');
          if (selectedAddress) {
            selectedAddress = JSON.parse(selectedAddress);
            this.goodsInfo.provinceName = selectedAddress.provinceName;
            this.goodsInfo.cityName = selectedAddress.cityName;
            this.goodsInfo.areaName = selectedAddress.areaName;
            this.goodsInfo.address = selectedAddress.address;
            this.goodsInfo.userAddressId = selectedAddress.id;
            this.goodsInfo.nickName = selectedAddress.nickName;
            this.goodsInfo.phone = selectedAddress.phone;
          }
        } else if (res.retCode == "10002") {
          this.$router.replace({
            path: '/wcoin/login'
          })
        }
      })
    },
    closeFun() {
      this.numberAlertShow = false;
    },
    sureFun(num) {
      this.numbers = num
      this.numberAlertShow = false;
    },
    check() {
      this.checkbox = !this.checkbox;
      this.orderObj.checkbox = this.checkbox;
      this.total();
    },
    total() {
      if (this.checkbox) {
        this.goodsInfo.total = parseFloat(this.goodsInfo.logisticsPrice) + parseFloat(this.goodsInfo.logisticsSafePrice)
      } else {
        this.goodsInfo.total = parseFloat(this.goodsInfo.logisticsPrice)
      }
    },
    //提交订单
    submitOrder(payPassword) {
      //平台币提交
      if (this.payType == "platform") {
        var params = {
          userAddressId: this.goodsInfo.userAddressId,
          goodsId: this.$route.query.goodsId,
          num: this.numbers,
          price: this.numbers,
          logisticsPrice: this.goodsInfo.logisticsPrice,
          logisticsSafePrice: this.checkbox ? this.goodsInfo.logisticsSafePrice : 0,
          total: this.goodsInfo.total,
          payMode: this.payType,
          remarks: '',
          payPassword: payPassword
        }
        this.$http.post('/apis' + '/goods_winery_order/create.htm', this.Qs.stringify(params)).then(res => {
          if (res.retCode == 0) {
            this.$toast({
              message: '支付成功',
              duration: 1200,
              className: 'success'
            });
            sessionStorage.removeItem('orderObj');
            this.$router.back(-1)

          } else if (res.retCode == "10002") {
            this.$router.replace({
              path: '/wcoin/login'
            })
          }
        })
      }
    },
    //关闭支付框
    closekey() {
      this.keyShow = false
    },
    //跳转页面
    targetInfo() {
      this.orderObj.num = this.numbers;
      // 保存数据到sessionStorage
      sessionStorage.setItem('orderObj', JSON.stringify(this.orderObj));
      this.$router.push({
        path: '/wcoin/myAddress',
        query: {
          selectAdd: true
        }
      })
    },
    suerBtn() {
      if (!this.goodsInfo.userAddressId) {
        this.$toast({
          message: '请选择收货地址',
          duration: 1200,
          className: 'warning'
        });
        return false;
      }
      //验证是否有支付密码
      this.$http.post('/apis' + '/user_info/check_password.htm', this.Qs.stringify({})).then(res => {
        if (res.retCode == 0) {
          if (res.data == 'n') {
            this.$toast({
              message: '暂未设置支付密码',
              duration: 1200,
              className: 'warning'
            });
          } else {
            if (this.state == 'VISA') {
              this.visaShow = true;
            } else {
              this.keyShow = true;
            }
          }
        } else if (res.retCode == "10002") {
          this.$router.replace({
            path: '/wcoin/login'
          })
        }
      })
    },
    // paypal 成功回调 
    paypalSuccess(res) {
      console.log(res);
      var params = {
        userAddressId: this.goodsInfo.userAddressId,
        goodsId: this.$route.query.goodsId,
        num: this.numbers,
        price: this.numbers,
        logisticsPrice: this.goodsInfo.logisticsPrice,
        logisticsSafePrice: this.checkbox ? this.goodsInfo.logisticsSafePrice : 0,
        total: this.goodsInfo.total,
        payMode: 'party',
        remarks: ''
      };
      this.$http.post('/apis' + '/goods_winery_order/create.htm', this.Qs.stringify(params)).then(res => {
        if (res.retCode == 0) {
          this.visaShow = false;
          this.$toast({
            message: '支付成功',
            duration: 1200,
            className: 'success'
          });
          this.$router.replace('/wcoin/myWine')
          sessionStorage.removeItem('orderObj');
        } else if (res.retCode == "10002") {
          this.$router.replace({
            path: '/wcoin/login'
          })
        }
      })
    },
    // paypal 授权成功回调 
    paypalAuthorized(res) {
      console.log(res);

    },
    // paypal 取消支付回调
    paypalCancel(res) {
      console.log(res);
      this.$toast({
        message: '支付取消',
        duration: 1200,
        className: 'warning'
      });
      this.visaShow = false;
    }
  }

}
</script>
<style scoped>
.alert-box{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  height: 100%;
  z-index: 10;
}
.boxs {
  padding-left: 40px;
}

.headline {
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
  font-size: 38px;
  color: #666666;
}

.addressBox {
  padding-top: 30px;
  padding-bottom: 70px;
}

.addressBox .left {
  width: 550px;
}

.addressBox .left h5 span {
  font-size: 32px;
  color: #333333;
}

.addressBox .left h5 span:first-child {
  margin-right: 30px;
}

.addressBox .left p {
  margin-top: 14px;
  font-size: 28px;
  color: #999999;
  line-height: 38px;
}

.addressBox .right {
  margin-top: 48px;
  padding-right: 40px;
}

.addressBox .right img {
  width: 13.3px;
}

.goodsList li {
  margin-top: 30px;
  background-color: #FAFAFA;
  width: 100%;
  overflow: hidden;
}

.goodsList .left img {
  width: 168px;
  height: 168px;
  float: left;
}

.goodsList .right {
  padding-top: 20px;
  width: 520px;
  float: right;
  padding-right: 40px;
}

.info-left {
  width: 540px;
  text-align: justify;
}

.info-left h4 {
  font-size: 30px;
  color: #333333;
  margin-bottom: 17px;
  line-height: 42px;
  min-height: 75px;
}

.info-left p {
  font-size: 30px;
  color: #333333;
}

.info-right {
  font-size: 30px;
  color: #333333;
  line-height: 42px;
}

.data-list {
  margin-top: 40px;
  margin-bottom: 120px;
}

.data-list li {
  margin-bottom: 28px;
  padding-right: 40px;
}

.data-list li:first-child .left {
  margin-top: 5px;
}

.data-list .left {}

.data-list .left span {
  font-size: 30px;
  color: #666666;
  vertical-align: text-bottom;
}

.data-list .left input {
  margin-left: 17px;
  vertical-align: text-bottom;
}

.data-list .right {
  font-size: 30px;
  color: #333333;
}

.data-list .right i {
  background: url(../../assets/img/icon-jian.png) no-repeat;
  background-size: 100% 100%;
  display: inline-block;
  width: 44px;
  height: 44px;
  vertical-align: text-bottom;
}

.data-list .right .add {
  background-image: url(../../assets/img/icon-jia.png);
}

.data-list .right .minus {}

.data-list .right input {
  vertical-align: text-bottom;
  background: #F2F2F2;
  width: 84px;
  height: 44px;
  text-align: center;
  padding: 0 5px;
  font-size: 28px;
  color: #333333;
}

.word-link {
  text-align: right;
  padding-right: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid #eee;
}

.word-link span {
  font-size: 26px;
  color: #666666;
  vertical-align: text-bottom;
}

.word-link img {
  width: 30px;
  vertical-align: text-bottom;
  margin-right: 6px;
}

.pay-type {
  padding-top: 35px;
  padding-bottom: 35px;
  border-bottom: 1px solid #eee;
  padding-right: 40px;
}

.pay-left {
  font-size: 32px;
  color: #333333;
}

.pay-right {}

.pay-right img {
  width: 13.3px;
  position: relative;
  top: 5px;
}

.footer-div {
  display: flex;
  justify-content: flex-end;
  position: fixed;
  height: 120px;
  line-height: 120px;
  padding-right: 20px;
  width: 100%;
  bottom: 0;
  left: 0;
  border-top: 1px solid #eee;
  background-color: #fff;
}

.prive-info {
  margin-right: 29px;
  margin-top: 45px;
}

.prive-info span {
  font-size: 28px;
  color: #666666;
}

.prive-info .red {
  color: #E50026;
}

.footer-div .btn {
  background: #E50026;
  width: 180px;
  height: 80px;
  color: #fff;
  font-size: 32px;
  text-align: center;
  line-height: 80px;
  margin-top: 19px;
}


/*弹框*/

.mint-popup {
  width: 100%;
}

.popup-main {
  width: 100%;
  padding: 40px;
  padding-right: 0;
  padding-bottom: 0;
  z-index: 2014;
  position: absolute;
  background-color: #fff;
  bottom: 0px;
}

.pop-title span {
  font-size: 54px;
  color: #000000;
}

.pop-title img {
  width: 70px;
  height: 70px;
  margin-right: 40px;
}

.pop-list {
  padding-left: 20px;
  margin-top: 24px;
  overflow-y: auto;
}

.pop-list li {
  height: 110px;
  line-height: 110px;
  border-bottom: 2px solid #eee;
  position: relative;
}

.pop-list li:last-child {
  border: none;
}

.pop-list .name {
  display: inline-block;
  width: 150px;
  font-size: 32px;
  color: #000000;
}

.pop-list .num {
  font-size: 32px;
  color: #999999;
}

.pop-list .select {
  position: absolute;
  right: 60px;
  top: 40px;
  width: 30px;
}

.visa-box {
  background-color: #fff;
  padding: 40px;
  padding-bottom: 120px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.visa-box .close {
  width: 70px;
  height: 70px;
}

.visa-box >>> iframe{
  z-index: 1000 !important;
}

.visa-box >>>.paypal-button-text{
  color: #fff !important;
}
</style>
