<template>
<div class="container">
  <common-title title="我的发布"></common-title>
  <div class="loadmore-container main">
    <mt-loadmore :bottom-method="getData" :bottom-all-loaded="noMoerData" ref="loadmore">
      <ul>
        <li class="list" v-for="item in listData" @click.stop="gotoDetail(item)">
          <div class="between">
            <div class="img-box">
              <img :src="item.logo" alt="">
            </div>
            <div class="list-main">
              <header class="between">
                <p>{{item.goodsName}}</p>
                <img src="../../assets/img/icon-edit.png" alt="" class="edit" @click.stop="editItem(item)" v-if="item.goodsState=='refuse'">
              </header>
              <p class="center">
                <span>留言 {{item.goodsLeaveNumber}}</span>
                <span>浏览 {{item.browseNumber}}</span>
              </p>
              <footer class="between">
                <span class="price">{{item.currencyName}}</span>
                <span class="type" :class="item.goodsState=='audit'?'red':item.goodsState=='agree'?'green':'balck'">{{item.goodsState=='audit'?'审核中':item.goodsState=='agree'?'发布成功':'审核未通过'}}</span>
              </footer>
            </div>
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
      listData: []
    }
  },
  components: {
    commonTitle
  },
  created() {
    this.getData()
  },
  methods: {
    // 获取列表数据
    getData() {
      var params = {
        pageNum: this.pageNum
      }
      this.$http.post('/apis' + 'goods/list.htm', this.Qs.stringify(params)).then(res => {
        if (res.retCode == 0) {
          if (res.data.length > 0) {
            this.listData = this.listData.concat(res.data);
            this.pageNum += 1; //pageNum++
            if (res.data.length < 10) {
              this.noMoerData = true; //数据为空赋值
              this.$refs.loadmore.onBottomLoaded();
            }
          } else {
            this.noMoerData = true; //数据为空赋值
            this.$toast({
              message: '没有更多数据',
              duration: 1200,
              className: 'warning'
            });
            this.$refs.loadmore.onBottomLoaded();
          }
        } else if (res.retCode == "10002") {
          this.$router.replace({
            path: '/wcoin/login'
          })
        }
      })
    },
    // 详情
    gotoDetail(item) {
      this.$router.push({
        path: '/wcoin/publishInfo',
        query: {
          id: item.id,
          state:item.goodsState
        }
      })
    },
    // 修改
    editItem(item) {
      this.$router.push({
        path: '/wcoin/sellWine',
        query: {
          isEdit: true,
          id: item.id
        }
      })
    }
  }
}
</script>

<style scoped>
.main {
  position: fixed;
  top: 195px;
  bottom: 0;
  left: 0;
  right: 0;
}

.main ul {
  padding: 10px 30px;
  height: 100%;
}

.list {
  height: 238px;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.16);
  margin-bottom: 30px;
}

.list img,
.list .img-box {
  width: 238px;
  height: 238px;
}

.list header p {
  font-size: 28px;
  color: #666666;
  padding-right: 60px;
  line-height: 39px;
  height: 76px;
}

.list header .edit {
  width: 32px;
  height: 32px;
}

.list-main {
  padding-left: 30px;
  padding-top: 30px;
  padding-right: 30px;
  width: 100%;
}

.center span {
  font-size: 22px;
  color: #cccccc;
  padding: 0 12px;
  border-left: 2px solid #eee;
}

.center {
  margin-top: 12px;
  margin-bottom: 25px;
  font-size: 0;
}

.center span:first-child {
  padding-left: 0;
  border: 0;
}

footer span {
  font-size: 30px;
  color: #333333;
}

.price {
  color: #e50026;
}

.black {
  color: #333;
}

.red {
  color: #ff4848;
}

.green {
  color: #1fdd7d;
}
</style>
