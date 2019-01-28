<template>
<div class="container">
  <common-title title="出售">
    <img src="../../assets/img/icon-list.png" slot alt="" @click="targetPage" class="slot-icon">
  </common-title>
  <div class="main">
    <header class="card">
      <p class="between card-title" @click="changeCard">
        <span>我的收款信息</span>
        <img src="../../assets/img/icon-right.png" alt="">
      </p>
      <p class="between">
        <span>持卡人</span>
        <i>{{defaultCard.realName}}</i>
      </p>
      <p class="between">
        <span>银行类型</span>
        <i>{{defaultCard.bankName}}</i>
      </p>
      <p class="between">
        <span>收款卡号</span>
        <i>{{defaultCard.cardNo}}</i>
      </p>
    </header>
    <main class="input-container">
      <div class="input-box between">
        <input v-model="params.number" @input="handleInput" type="text" :placeholder="'卖出数量，可出售'+maxNumber+'个'">
        <p @click="sellAll">全部卖出</p>
      </div>
      <div class="input-box between" v-if="sellType=='shortcut'">
        <input v-model="params.price" type="number" placeholder="请输入出售单价">
        <p>EUR</p>
      </div>
      <div class="input-box" v-else>
        <input type="text" readonly :value="params.price+' EUR'">
      </div>
    </main>
    <div class="common-btn" @click="sellNow()">
      立即卖出
    </div>
  </div>
  <keyboard @changeNum="submitPwd" v-show="keyShow" @closePwd="closekey"></keyboard>
</div>
</template>
<script>
import commonTitle from '@/components/common-title'
import keyboard from '@/components/keyboard'
export default {
  data() {
    return {
      defaultCard: {}, // 默认银行卡
      userWcoinInfo: {}, // 用户wcoin信息
      maxNumber: '',
      keyShow: false,
      sellType: this.$route.query.type,
      surplusNumber: this.$route.query.surplusNumber,
      params: {
        number: '',
        price: this.$route.query.price ? this.$route.query.price : '',
        payPassword: ''
      }
    }
  },
  components: {
    commonTitle,
    keyboard
  },
  created() {
    this.initData();
  },
  methods: {
    handleInput(e) {
      this.params.number = e.target.value.replace(/[^.\d]/g, '');
      if (parseFloat(this.params.number) > parseFloat(this.maxNumber)) {
        this.params.number = this.maxNumber;
      }
    },
    // 全部卖出
    sellAll() {
      this.params.number = this.maxNumber;
    },
    // 立刻卖出
    sellNow() {
      if (parseFloat(this.params.number)<=0) {
        this.$toast({
          message: '出售数量不能为零',
          className: 'warning',
          duration: 1200
        });
        return false;
      }
      if (parseFloat(this.params.price)<=0) {
        this.$toast({
          message: '出售单价不能为零',
          className: 'warning',
          duration: 1200
        });
        return false;
      }
      if (!this.params.number || !this.params.price) {
        this.$toast({
          message: '请输入数量与单价',
          duration: 1200,
          className: 'warning'
        });
        return false;
      }
      if (!this.defaultCard.id) {
        this.$toast({
          message: '请选择银行卡',
          duration: 1200,
          className: 'warning'
        });
        return false;
      }
      if (!this.globalData.hasRealInfo) {
        this.$http.post('/apis' + 'user_real/info.htm').then(res => {
          if (res.retCode == '0') {
            if (res.data.realAudit == 'agree') {
              console.log(res.data)
              this.globalData.hasRealInfo = true;
              this.checkPwd();
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
        this.checkPwd();
      }
    },
     //验证是否有支付密码
    checkPwd(){
      this.$http.post('/apis' + '/user_info/check_password.htm', this.Qs.stringify({})).then(res => {
        if (res.retCode == 0) {
          if (res.data == 'n') {
            this.$toast({
              message: '暂未设置支付密码',
              duration: 1200,
              className: 'warning'
            });
          } else {
            this.keyShow = true;
          }
        } else if (res.retCode == "10002") {
          this.$router.replace({
            path: '/wcoin/login'
          })
        }
      })
    },
    // 初始化数据
    initData() {
      var selectedBankCard = JSON.parse(sessionStorage.getItem('selectedBankCard'));
      if (!selectedBankCard) {
        this.getDefaultCard();
      } else {
        this.defaultCard = selectedBankCard;
      }
      this.getUserWcoinInfo();
    },
    // 选择银行卡
    changeCard() {
      this.$router.push({
        path: "/wcoin/myCard",
        query: {
          selectCard: true
        }
      })
    },
    // 获取用户默认的银行卡信息
    getDefaultCard() {
      this.$http.post('/apis' + 'user_bank/info.htm').then(res => {
        if (res.retCode == 0) {
          if (res.data) {
            this.defaultCard = res.data;
          } else {
            this.$toast({
              message: '请先绑定银行卡',
              duration: 1200,
              className: 'warning'
            });
          }
        } else if (res.retCode == "10002") {
          this.$router.replace({
            path: '/wcoin/login'
          })
        }
      })
    },
    // 查询用户wcoin信息
    getUserWcoinInfo() {
      this.$http.post('/apis' + 'user_currency/info.htm').then(res => {
        if (res.retCode == 0) {
          this.userWcoinInfo = res.data;
          if (this.sellType == 'shortcut') {
            this.maxNumber = this.userWcoinInfo.balanceNumber;
          } else {
            this.maxNumber = this.surplusNumber < this.userWcoinInfo.balanceNumber ? this.surplusNumber : this.userWcoinInfo.balanceNumber;
          }
        } else if (res.retCode == "10002") {
          this.$router.replace({
            path: '/wcoin/login'
          })
        }
      })
    },
    // 提交密码
    submitPwd(num) {
      this.params.payPassword = num;
      var params, url;
      if (this.sellType == 'common') {
        params = {
          userBankId: this.defaultCard.id,
          number: this.params.number,
          payPassword: this.params.payPassword,
          id: this.$route.query.id
        }
        url = "user_wcoin_buy/sell.htm";
      } else {
        params = Object.assign({
          userBankId: this.defaultCard.id
        }, this.params);
        url = "user_wcoin_sell/save.htm";
      }
      this.$http.post('/apis' + url, this.Qs.stringify(params)).then(res => {
        if (res.retCode == 0) {
          //完成跳转
          var cardNo = this.defaultCard.cardNo + '';
          var four = cardNo.substring(cardNo.length - 4);
          this.$router.replace({
            path: '/wcoin/orderResult',
            query: {
              type: 2,
              number: params.number,
              bankName: this.defaultCard.bankName,
              cardNo: four
            }
          })
        } else if (res.retCode == "10002") {
          this.$router.replace({
            path: '/wcoin/login'
          })
        }
      })
    },
    //
    closekey(num) {
      this.keyShow = false;
    },
    targetPage() {
      sessionStorage.setItem("sortNav", 2); //赋值sessionStorage的sortNav值
      this.$router.push({
        path: '/wcoin/transaction'
      })
    }
  }
}
</script>
<style scoped>
.slot-icon {
  width: 35.7px;
  height: 42px;
  margin-right: 40px;
  margin-top: 10px;
}

.main {
  padding-left: 40px;
}

.card {
  width: 670px;
  height: 296px;
  background: url(../../assets/img/Bitmap.jpg) no-repeat;
  background-size: 100% 100%;
  padding: 30px 40px;
  margin-bottom: 45px;
}

.card p {
  margin-bottom: 25px;
  line-height: 40px;
}

.card span {
  font-size: 28px;
  color: #666666;
}

.card i {
  font-size: 28px;
  color: #333333;
}

.card-title span {
  font-size: 36px;
  color: #333333;
}

.card-title img {
  height: 25.2px;
  width: 13.3px;
  margin-top: 12px;
}

.card .card-title {
  margin-bottom: 35px;
  line-height: 50px;
}

.input-box {
  height: 110px;
  line-height: 110px;
  overflow: hidden;
  padding-right: 40px;
  border-bottom: 2px solid #eee;
}

.input-box p {
  font-size: 32px;
  color: #333333;
  line-height: 108px;
}

.input-box input {
  line-height: 108px;
  font-size: 32px;
  color: #333;
  width: 500px;
}

.common-btn {
  margin-top: 180px;
}
</style>
