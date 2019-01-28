<template>
<div class="container">
  <common-title title="转账" sub-text="钱将实时转入对方账户，无法退款">
    <router-link to="/wcoin/transferRecord" slot class="slot-icon">
      <img src="../../assets/img/icon-list.png" alt="">
    </router-link>
  </common-title>
  <div class="main">
    <div class="user">
      <img v-if="targetUserInfo.avatarUrl" :src="'http://apppay.oss-cn-hangzhou.aliyuncs.com/'+targetUserInfo.avatarUrl" alt="">
      <div class="info">
        <p>{{targetUserInfo.nickName}}</p>
        <span>{{targetUserInfo.mobileNo}}</span>
      </div>
    </div>
    <div class="input-box between">
      <input v-model="params.number" type="number" placeholder="请输入转账金额" @input="inputFun">
      <div class="right" @click="popupVisible=true">
        <span>{{selectCurrency?selectCurrency.currencyName:'请选择币种'}}</span>
        <img src="../../assets/img/icon-right.png" alt="">
      </div>
    </div>
    <div class="input-box">
      <input v-model="params.remarks" class="all-input" type="text" placeholder="备注" maxlength="50" >
    </div>
    <div class="common-btn" @click="payPwd">
      下一步
    </div>
  </div>
  <!-- 选择币种 -->
  <mt-popup v-model="popupVisible" popup-transition="popup-fade" position="bottom">
    <div class="popup-main">
      <p class="between pop-title">
        <span>请选择币种</span>
        <img src="../../assets/img/alert-close.png" alt="" class="close" @click="popupVisible=false">
      </p>
      <ul class="pop-list">
        <li @click="selectItem(item)" v-for="item in userCurrency">
          <span class="name">{{item.currencyName}}</span>
          <span class="num">剩余{{item.balanceNumber}}个</span>
          <img src="../../assets/img/icon-select.png" alt="" class="select" v-if="selectCurrency&&item.id==selectCurrency.id">
        </li>
      </ul>
    </div>
  </mt-popup>
  <!-- 支付键盘 -->
  <keyboard v-if="toggleKeyboard" @changeNum="payPwdEnd" @closePwd="toggleKeyboard=false"></keyboard>
</div>
</template>

<script>
import commonTitle from '@/components/common-title'
import keyboard from '@/components/keyboard'
export default {
  data() {
    return {
      popupVisible: false, //币种选择弹框
      toggleKeyboard: false, // 支付键盘
      targetUserInfo: {},
      userInfo: {},
      userCurrency: [], // 用户持有币种列表
      selectCurrency: null,
      params: {
        number: null,
        remarks: '',
        payPassword: '',
      }
    }
  },
  components: {
    commonTitle,
    keyboard
  },
  created() {
    var targetUserInfo = sessionStorage.getItem('transferOtherInfo');
    if (targetUserInfo) {
      this.targetUserInfo = JSON.parse(targetUserInfo)
    }
    this.getUserInfo();
  },
  methods: {
    // 获取用户id
    getUserInfo() {
      this.$http.get('/apis' + 'user_info/info.htm').then(res => {
        if (res.retCode == 0) {
          this.userInfo = res.data;
          this.getUserCurrency(res.data.id);
        } else if (res.retCode == '10002') {
          this.$router.push('/wcoin/login');
        }
      })
    },
    // 查询用户持有币种列表
    getUserCurrency(id) {
      this.$http.post('/apis' + 'user_currency/list.htm', this.Qs.stringify({
        userId: id
      })).then(res => {
        if (res.retCode == 0) {
          this.userCurrency = res.data;
        } else if (res.retCode == '10002') {
          this.$router.push('/wcoin/login');
        }
      })
    },
    // 输入限制最大数量
    inputFun() {
      if (!this.selectCurrency) {
        this.$toast({
          message: "请选择币种",
          className: 'warning',
          duration: 1200
        });
        this.params.number = '';
        return false;
      }
      this.params.number = parseFloat(this.selectCurrency.balanceNumber) < parseFloat(this.params.number) ? this.selectCurrency.balanceNumber : this.params.number;
      if (this.selectCurrency.balanceNumber <= 0 ) {
        this.$toast({
          message: "币种余额不足",
          className: 'warning',
          duration: 1200
        });
        this.params.number = '';
      }
    },
    // 选择币种
    selectItem(item) {
      this.selectCurrency = item;
      this.params.number = '';
      this.popupVisible = false;
    },
    // 输入密码
    payPwd() {
      if (!this.selectCurrency || !this.params.number) {
        this.$toast({
          message: "请选择币种并输入金额",
          className: 'warning',
          duration: 1200
        });
        return false;
      }
      if (!this.params.remarks) {
        this.$toast({
          message: "请输入备注",
          className: 'warning',
          duration: 1200
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
            this.toggleKeyboard = true;
          }
        } else if (res.retCode == "10002") {
          this.$router.replace({
            path: '/wcoin/login'
          })
        }
      })

    },
    // 输入密码完成回调
    payPwdEnd(res) {
      this.params.payPassword = res;
      var params = Object.assign({
        userId: this.targetUserInfo.id,
        userCurrencyId: this.selectCurrency.id
      }, this.params);
      this.$http.post('/apis' + 'user_transfer/save.htm', this.Qs.stringify(params)).then(res => {
        if (res.retCode == 0) {
          this.$toast({
            message: "转账成功",
            className: 'success',
            duration: 1200
          });
          this.$router.back(-1);
        } else if (res.retCode == '10002') {
          this.$router.push('/wcoin/login');
        }
      })
    }
  }
}
</script>

<style scoped>
.slot-icon img {
  width: 35.7px;
  height: 42px;
  margin-right: 40px;
  margin-top: 10px;
}

.main {
  padding-left: 40px;
  margin-top: 20px;
}

.user {
  margin-bottom: 47px;
}

.user img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 40px;
}

.user .info {
  display: inline-block;
  vertical-align: top;
}

.info p {
  font-size: 32px;
  color: #333333;
  margin-top: 6px;
  margin-bottom: 6px;
}

.info span {
  font-size: 28px;
  color: #333333;
}

.input-box {
  height: 110px;
  line-height: 110px;
  border-bottom: 2px solid #eee;
  position: relative;
}

.input-box input {
  font-size: 32px;
  color: #333;
  width: 350px;
  line-height: 108px;
}

.input-box .all-input {
  width: 100%;
  padding-right: 40px;
}

.right {
  padding-top: 36px;
  padding-right: 40px;
}

.right img {
  height: 25.2px;
  vertical-align: middle;
  margin-left: 40px;
  vertical-align: middle;
}

.right span {
  font-size: 30px;
  vertical-align: middle;
  color: #999999;
}

.common-btn {
  margin-top: 150px;
}

.mint-popup {
  width: 100%;
}

.popup-main {
  width: 100%;
  height: 721px;
  padding: 40px;
  padding-right: 0;
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
  height: 550px;
  overflow-y: auto;
}

.pop-list li {
  height: 110px;
  line-height: 110px;
  border-bottom: 2px solid #eee;
  position: relative;
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
</style>
