<template>
  <div class="container">
    <common-title title="购买">
      <img src="../../assets/img/icon-list.png" class="link-img" @click="targetPage">
  </common-title>
      <div class="list-box">
        <div class="list between">
          <input type="text" v-model="numbers" @input="handleInput" maxlength="20" name="" placeholder="请输入购买数量"><span>个</span>
        </div>
        <div class="list between">
          <input type="text" v-model="money" @input="moneyInput" maxlength="20" name="" placeholder="请输入购买单价"><span>EUR</span>
        </div>
      </div>
      <div class="common-btn" @click="suerBuy">确认购买</div>
      <keyboard @changeNum="submitPwd" v-show="keyShow" @closePwd="closekey"></keyboard>
  </div>
</template>
<script>
import commonTitle from '@/components/common-title';
import keyboard from '@/components/keyboard'
export default {
  components: {
    commonTitle,
    keyboard
  },
  data() {
    return {
      numbers: '',
      money: '',
      keyShow: false,
      hasPayPwd: 'n'
    }
  },
  created() {
    this.checkPassword();
  },
  methods: {
    handleInput(e) {
      this.numbers = e.target.value.replace(/[^.\d]/g, '');
    },
    moneyInput(e) {
      this.money = e.target.value.replace(/[^.\d]/g, '');
    },
    // 检查是否设置支付密码
    checkPassword() {
      this.$http.post('/apis' + 'user_info/check_password.htm').then(res => {
        if (res.retCode == 0) {
          this.hasPayPwd = res.data;
        } else if (res.retCode == '10002') {
          this.$router.push('/wcoin/login');
        }
      })
    },
    // 确认购买
    suerBuy() {

      if (this.numbers != '' && this.money != '') {
        if (parseFloat(this.numbers) <= 0) {
          this.$toast({
            message: '购买数量不能为零',
            className: 'warning',
            duration: 1200
          });
          return false;
        }
        if (parseFloat(this.money) <= 0) {
          this.$toast({
            message: '购买单价不能为零',
            className: 'warning',
            duration: 1200
          });
          return false;
        }
        
        if (this.hasPayPwd == 'n') {
          this.$toast({
            message: '请先设置支付密码',
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
                this.keyShow = true
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
        } else {
          this.keyShow = true
        }
      } else if (this.money != '' || this.numbers == '' && this.money == '') {
        this.$toast({
          message: '请输入购买数量',
          duration: 1200,
          className: 'warning'
        });
      } else if (this.numbers != '') {
        this.$toast({
          message: '请输入购买单价',
          duration: 1200,
          className: 'warning'
        });
      }
    },
    //提交支付密码
    submitPwd(num) {
      //支付成功后
      var params = {
        number: this.numbers,
        price: this.money,
        payPassword: num
      }
      this.$http.post('/apis' + 'user_wcoin_buy/save.htm', this.Qs.stringify(params)).then(res => {
        if (res.retCode == 0) {
          this.$router.replace({
            path: '/wcoin/orderResult',
            query: {
              type: 1,
              number: this.numbers,
              totalPrice: (this.money * this.numbers).toFixed(2)
            }
          })
        } else if (res.retCode == '10002') {
          this.$router.push('/wcoin/login');
        }
      })

    },
    //关闭支付框
    closekey() {
      this.keyShow = false
    },
    targetPage() {
      //支付成功后
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
  color: #999;
  height: 108px;
  width: 500px;
  background-color: transparent;
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

</style>
