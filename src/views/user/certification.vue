<template>
<div class="container">
  <common-title :title="state=='wait'?'待审核':state=='agree'?'已认证':state=='refuse'?'审核失败':'实名认证'"></common-title>
  <div class="main">
    <div class="input-box">
      <input type="text" v-model="userName" maxlength="12" :readonly="disabled"  placeholder="请输入真实姓名">
    </div>
    <div class="input-box">
      <input type="text" v-model="cardID" @input="handleInput" maxlength="18" :readonly="disabled" placeholder="请输入身份证号码（将加密处理）">
    </div>
    <div class="imgbox" v-if="userInfo.realAudit!='wait'&&userInfo.realAudit!='agree'">

      <a href="javascipt:;" @click="targetPage" class="common-btn">下一步</a>
    </div>
    <div v-else>
      <div class="upload">
        <img :src="userInfo.cardFace" alt="">
      </div>
      <div class="upload">
        <img :src="userInfo.cardSide" alt="">
      </div>
    </div>

  </div>
</div>
</template>
<script>
import commonTitle from '@/components/common-title'
export default {
  components: {
    commonTitle
  },
  data() {
    return {
      cardID: '',
      userName: '',
      state: '',
      userInfo: {},
      title: '',
      disabled: 'false'
    }
  },
  created() {
    this.getUser();
  },
  methods: {
    handleInput(e) {
      this.cardID = e.target.value.replace(/[^xX\d]/g, '');
    },
    targetPage() {
      if (!this.userName) {
        this.$toast({
          message: '请输入真实姓名',
          duration: 1200,
          className: 'warning'
        });
        return false;
      }
      var reg=/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/;
      if(reg.test(this.userName)){    
          this.$toast({
            message: '请输入正确的姓名',
            duration: 1200,
            className: 'warning'
          });
          return false;    
      }      
      if (!this.cardID) {
        this.$toast({
          message: '请输入身份证号码',
          duration: 1200,
          className: 'warning'
        });
        return false;
      } else {
        if (!this.validate('idCard', this.cardID)) {
          this.$toast({
            message: '身份证号格式不正确',
            className: 'warning',
            duration: 1200
          })
          return false;
        }
      }
      var item = {};
      item.userName = this.userName;
      item.cardID = this.cardID;
      item.cardFace = this.userInfo.cardFace
      item.cardSide = this.userInfo.cardSide
      sessionStorage.setItem("userReal", JSON.stringify(item));
      this.$router.push({
        path: '/wcoin/certificationIdCard',
        query: {
          state: this.state
        }
      })
    },
    getUser() {
      this.$http.post('/apis' + '/user_real/info.htm', this.Qs.stringify({})).then(res => {
        if (res.retCode == 0) {
          this.userInfo = res.data
          this.userName = res.data.realName;
          this.cardID = res.data.cardNo;
          this.state = res.data.realAudit;
          if (this.state != "wait" && this.state != "agree") {
            this.disabled = false;
          } else {
            this.disabled = true;
          }
        } else if (res.retCode == "10002") {
          this.$router.replace({
            path: '/wcoin/login'
          })
        }
      })
    },
    inputOn(e){
      e.target.value = e.target.value.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/g,'[表情]');
    }
  }
}
</script>
<style scoped>
.main {
  padding-left: 40px;
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
  width: 100%;
  line-height: 108px;
}

.common-btn {
  margin-top: 100px;
}

.upload img {
  width: 294px;
  height: 194px;
  object-fit: fill;
}

.upload:first-child {
  margin-bottom: 90px;
  margin-top: 58px;
}

input:disabled,
input[disabled] {
  background-color: transparent;
  opacity: 1;
}
</style>
