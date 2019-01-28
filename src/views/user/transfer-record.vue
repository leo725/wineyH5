<template>
<div class="container">
  <common-title title="转账记录"></common-title>
  <div class="loadmore-container">
    <mt-loadmore :bottom-method="getTransfer" ref="loadmore" :bottom-all-loaded="noMoerData" :bottom-pull-text="noMoerData?'没有更多数据':'加载更多'">
      <ul class="list">
        <li class="between" @click="gotoDetail(item)" v-for="item in transferList">
          <div class="img-box">
            <img :src="item.avatarUrl" alt="">
          </div>
          <div class="main">
            <div class="info">
              <span class="name">{{item.remarks}}</span>
              <p class="price">{{item.currencyNumber}} {{item.currencyName}}</p>
              <span class="time">{{item.createTime|timeNoYear}}</span>
            </div>
            <img src="../../assets/img/icon-right.png" alt="" class="icon-right">
          </div>
        </li>
      </ul>
    </mt-loadmore>
  </div>

</div>
</template>

<script>
import commonTitle from '@/components/common-title'
export default {
  data() {
    return {
      noMoerData: false,
      pageNum: 0,
      transferList: []
    }
  },
  components: {
    commonTitle
  },
  created() {
    this.getTransfer()
  },
  methods: {
    gotoDetail(item) {
      // 转账详情
      this.$router.push({
        path: '/wcoin/transferDetail',
        query: {
          id: item.id,
          type: item.type
        }
      })
    },
    // 获取转账记录
    getTransfer() {
      var params = {
        pageNum: this.pageNum
      }
      this.$http.post('/apis' + 'user_transfer/list.htm', this.Qs.stringify(params)).then(res => {
        if (res.retCode == 0) {
          if (res.data.length > 0) {
            this.transferList = this.transferList.concat(res.data);
            this.pageNum += 1; //pageNum++
            if (res.data.length < 10) {
              this.noMoerData = true; //数据为空赋值
              this.$refs.loadmore.onBottomLoaded();
            }
          } else {
            this.$refs.loadmore.onBottomLoaded();
            this.noMoerData = true; //数据为空赋值
            this.$toast({
              message: '没有更多数据',
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
    }
  }
}
</script>

<style scoped>
.list {
  padding-left: 40px;
}

.list li {
  height: 230px;
  padding-top: 30px;
}

.img-box img {
  width: 100px;
  height: 100px;
}

.main {
  width: 570px;
  position: relative;
  height: 200px;
  border-bottom: 2px solid #eee;
}

.main .icon-right {
  position: absolute;
  right: 40px;
  top: 73px;
  height: 25.2px;
}

.main .name {
  font-size: 30px;
  color: #333333;
}

.main .price {
  font-size: 36px;
  color: #333333;
  margin-top: 12px;
  margin-bottom: 34px;
}

.main .time {
  font-size: 30px;
  color: #cccccc;
}
</style>
