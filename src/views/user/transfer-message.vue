<template>
  <div class="container">
    <common-title title="转账通知"></common-title>
    <div class="main">
      <ul>
        <li class="list between" @click="gotoDetail">
          <div class="list-main">
            <img src="../../assets/img/service.png" alt="">
            <div class="info">
              <p>来自未知生物的转账</p>
              <span>09-08 12:34 </span>
            </div>
          </div>
          <img src="../../assets/img/icon-right.png" alt="" class="icon-right">
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import commonTitle from '@/components/common-title'
export default {
  components: { commonTitle },
  methods: {
    gotoDetail(item) {
      this.$router.push({
        path: '/wcoin/transferDetail'
      })
    }
  }
}
</script>

<style scoped>
.container {
  background-color: #fff;
  height: 100%;
}
.main {
  padding-left: 40px;
}
.list {
  height: 180px;
  border-bottom: 2px solid #eee;
  padding: 40px 0;
  position: relative;
}
.list-main {
  font-size: 0;
}
.list-main img {
  width: 100px;
  height: 100px;
  margin-right: 40px;
}
.info {
  display: inline-block;
  vertical-align: top;
  width: 500px;
}
.info p {
  font-size: 32px;
  color: #333333;
  margin-bottom: 12px;
  margin-top: 6px;
}
.info span {
  font-size: 30px;
  color: #cccccc;
}
.icon-right {
  height: 25.2px;
  position: absolute;
  right: 40px;
  top: 77.4px;
}
</style>
