<template>
  <div class="container">
    <common-title title="转账结果" fontsColor='#000' class="setting-title"></common-title>
    <div class="list">
      <div class="line_caries"></div>
      <div class="list-top clearfix">
        <img src="../../assets/img/right.png">
        <p>转账成功</p>
        <h5>100 Wcoin</h5>
      </div>
      <div class="list-bottom">
        <div class="priceBottom">
          <p>收款方: 18258212172</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import commonTitle from '@/components/common-title';
export default {
  components: { commonTitle },
  data() {
    return {
      text: '待收货',
      orderId: 0, //订单id
    }
  },
  mounted() {

  },
  created() {

  },
  methods: {}

}

</script>
<style scoped>
.container {
  min-height: 100%;
  background-color: #F3F2F0;
  width: 100%;
}
.list {
  width: 690px;
  margin: 0 auto;
  margin-top: -20px;
}
.line_caries {
  height: 15px;
  background: url(../../assets/img/line_caries.png) no-repeat;
  width: 100%;
  background-size: 100% 100%;
}
.list-top {
  padding-top: 70px;
  width: 100%;
  background-color: #fff;
  text-align: center;
  padding-bottom: 80px;
}
.list-top img {
  width: 168px;
}
.list-top p {
  margin-top: 16px;
  text-align: center;
  font-size: 38px;
  color: #E50026;
}
.list-top h5 {
  font-size: 48px;
  color: #333333;
  margin-top: 35px;
  text-align: center;
}
.list-bottom {
  background-color: #fff;
  width: 100%;
  padding: 0 60px;
}
.priceBottom {
  border-top: 2px solid #D9D9D9;
  padding-bottom: 30px;
  padding-top: 15px;
}
.priceBottom p {
  margin-top: 15px;
  font-size: 28px;
  color: #CCCCCC;
}

</style>
