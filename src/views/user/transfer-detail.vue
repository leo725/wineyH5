<template>
<div class="container">
  <common-title title="转账详情" fonts-color='#fff'></common-title>
  <div class="main">
    <div class="detail" :class="transferType?'to':''">
      <header>
        <div>
          <img :src="transferDetail.avatarUrl" alt="">
          <span>{{transferDetail.content}}</span>
        </div>
      </header>
      <main>
        <p class="number">
          <span v-if="!transferType">+ </span>{{transferDetail.currencyNumber}} {{transferDetail.currencyName}}
        </p>
        <div class="other between">
          <span class="left-span">转账说明</span>
          <span class="black">{{transferDetail.remarks}}</span>
        </div>
      </main>
      <footer>
        <p>
          <label>转账时间：</label>
          <span>{{transferDetail.createTime|dateAndTime}}</span>
        </p>
        <p>
          <label>转账单号：</label>
          <span>{{transferDetail.orderNo}}</span>
        </p>
      </footer>
    </div>
  </div>
</div>
</template>

<script>
import commonTitle from '@/components/common-title'
export default {
  data() {
    return {
      transferType: this.$route.query.type == '+' ? false : true, // 转出 or  转入
      transferDetail: {}
    }
  },
  components: {
    commonTitle
  },
  created() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      this.$http.post('/apis' + 'user_transfer/detail.htm', this.Qs.stringify({
        id: this.$route.query.id
      })).then(res => {
        if (res.retCode == 0) {
          this.transferDetail = res.data;
        } else if (res.retCode == '10002') {
          this.$router.push('/wcoin/login');
        }
      })
    }
  }
}
</script>

<style scoped>
.container {
  height: 100%;
  background-color: #e50026;
}

.main {
  padding: 0 30px;
}

.detail {
  height: 715px;
  background: url(../../assets/img/white-bg.png) no-repeat;
  background-size: 100% 100%;
  padding: 0 30px;
  padding-top: 45px;
}

.detail header {
  overflow: hidden;
  padding-bottom: 40px;
  border-bottom: 2px solid #eee;
}

.to header div img,
.to header div span {
  float: right;
  line-height: 68px;
}

.detail header img {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  vertical-align: middle;
  margin-right: 25px;
  margin-left: 20px;
}

.detail header span {
  font-size: 28px;
  color: #666666;
  vertical-align: middle;
}

.detail main .number,
.number span {
  height: 327px;
  line-height: 327px;
  text-align: center;
  font-size: 54px;
  color: #e50026;
}

.to main .number ,.to .number span{
  color: #333333;
}

main .other {
  padding-bottom: 30px;
  border-bottom: 2px solid #eee;
}

main .other span {
  font-size: 30px;
  color: #666666;
}

.other .black {
  color: #333333;
  width: 450px;
  text-align: right;
}

.detail footer {
  padding-top: 30px;
}

.detail footer p {
  margin-bottom: 12px;
}

.detail footer label,
.detail footer span {
  font-size: 28px;
  color: #cccccc;
}
.left-span{
  width: 150px;
  display: block;
}
</style>
