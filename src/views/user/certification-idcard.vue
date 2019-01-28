<template>
<div class="container">
  <common-title title="实名认证"></common-title>
  <p class="sub-title">
    <img src="../../assets/img/info.png" alt="">
    <span>请上传原始比例的身份证正反面，请勿裁剪涂改，保证身份信息清</span>
  </p>
  <div class="main">
    <div class="card-box" v-if="state!='wait'&&state!='agree'">
      <upload accept="image/*" :multiple="false" class="upload" @uploadSuccess="uploadSuccess1">
        <img v-if="!idCard1" src="../../assets/img/idcard1.png" alt="">
        <img v-else :src="idCard1" alt="">
      </upload>
      <upload accept="image/*" :multiple="false" class="upload" @uploadSuccess="uploadSuccess2">
        <img v-if="!idCard2" src="../../assets/img/idcard.png" alt="">
        <img v-else :src="idCard2" alt="">
      </upload>
    </div>
    <div class="card-box" v-else>
      <div class="upload">
        <img  :src="list.cardFace" alt="">
      </div>
      <div class="upload">
        <img  :src="list.cardSide" alt="">
      </div>
    </div>
    <div v-if="state!='wait'&&state!='agree'" class="common-btn" @click="save">完成</div>
  </div>
</div>
</template>
<script>
import commonTitle from '@/components/common-title'
import upload from '@/components/upload'
export default {
  data() {
    return {
      fileList: [],
      idCard1: '', // 正面
      idCard2: '', // 反面
      list: JSON.parse(sessionStorage.getItem("userReal")),
      state:this.$route.query.state,
    }
  },
  components: {
    commonTitle,
    upload
  },
  created() {
    console.log(this.state)
  },
  methods: {
    // 文件上传成功
    uploadSuccess1(res) {
      this.idCard1 = res.url;
    },
    uploadSuccess2(res) {
      this.idCard2 = res.url;
    },
    save() {
      if (!this.idCard1 || !this.idCard2) {
        this.$toast({
          message: '请上传完身份证正反面照',
          duration: 1200,
          className: 'warning'
        });
        return false;
      }
      var params = {
        realName: this.list.userName,
        cardNo: this.list.cardID,
        cardFace: this.idCard1.replace('http://apppay.oss-cn-hangzhou.aliyuncs.com/', ''),
        cardSide: this.idCard2.replace('http://apppay.oss-cn-hangzhou.aliyuncs.com/', '')
      }
      this.$http.post('/apis' + 'user_real/save.htm', this.Qs.stringify(params)).then(res => {
        if (res.retCode == 0) {
          this.$toast({
            message: '操作成功',
            duration: 1200,
            className: 'success'
          });
          this.$router.replace({
            path: '/wcoin/user'
          })
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
.sub-title {
  padding: 0 40px;
  position: relative;
  top: -50px;
}

.sub-title img {
  width: 30px;
  height: 30px;
  margin-right: 10px;
  vertical-align: middle;
}

.sub-title span {
  vertical-align: middle;
  font-size: 28px;
  color: #999999;
}

.main {
  padding-left: 40px;
  padding-top: 60px;
}

.card {
  margin-bottom: 90px;
}

.card img {
  width: 294px;
  height: 194px;
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
}
</style>
