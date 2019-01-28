<template>
<div class="list">
  <ul>
    <li v-for="item in dataList">
      <router-link :to="{path: '/wcoin/goodsInfo', query:{id: item.id}}">
        <div class="imgbox">
          <img :src="item.logo">
        </div>
        <h5>{{item.goodsName}}</h5>
        <h6><span><b></b>{{item.currencyName}}</span><i>已售{{item.trueSalesVolume}}</i></h6>
      </router-link>
    </li>
  </ul>
</div>
</template>
<script>
export default {
  props: {
    dataList: {
      type: Array,
      default: []
    },
  },
  data() {
    return {

    }
  }
}
</script>
<style scoped>
.list {
  padding-bottom: 120px;
}

.list ul {
  padding: 30px;
  padding-bottom: 0;
}

.list ul li {
  width: 330px;
  float: left;
  margin-bottom: 45px;
}

.list ul li:nth-child(2n) {
  margin-left: 30px;
}

.list ul li h5 {
  margin-top: 20px;
  font-size: 28px;
  color: #333333;
  margin-bottom: 9px;
  height: 76px;
  line-height: 38px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.list ul li .imgbox {
  width: 330px;
  height: 330px;
  overflow: hidden;
}

.list ul li img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.list ul li h6 {
  display: flex;
  justify-content: space-between;
  overflow: hidden;
}

.list ul li h6 span {
  font-size: 28px;
  color: #E50026;
}

.list ul li h6 b {
  font-size: 36px;
  color: #E50026;
  font-weight: normal;
}

.list ul li h6 i {
  font-size: 22px;
  color: #CCCCCC;
  position: relative;
  top: 12px;
}
</style>
