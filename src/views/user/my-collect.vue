<template>
  <div class="container">
    <common-title title="我的收藏"></common-title>
    <div class="loadmore-container">
      <mt-loadmore :bottom-method="getList" ref="loadmore" :bottom-all-loaded="noMoerData" :bottom-pull-text="noMoerData?'没有更多数据':'加载更多'" class="main">
        <ul>
          <li class="list between" v-for="(item,index) in dataList" @click="tragetInfo(item.goodsId)">
            <img :src="item.logo" alt="">
            <div class="list-main">
              <header class="between">
                <div class="shop">
                  <div class="imgbox">
                    <img :src="item.avatarUrl" alt="">
                  </div>
                    <span>{{item.nickName}}</span>
                </div>
                <div class="del-box" @click.stop="deleteItem(item.goodsId,index)">
                  <img src="../../assets/img/delete.png" alt=""  class="delete" >
                </div>
              </header>
              <main>
                <p>{{item.goodsName|substr(10)}}</p>
                <div class="other">
                  <p class="other-other">
                    <span>库存{{item.stockNumber}}</span>
                    <span>{{item.sendAddress|substr(10)}}</span>
                  </p>
                  <span class="red">{{item.currenctName|substr(10)}}</span>
                  
                </div>
              </main>
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
  components: { commonTitle },
  data() {
    return {
      pageNum: 0,
      dataList: [],
      noMoerData: false
    }
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取更多
    getMore() {

    },
    tragetInfo(id) {
      this.$router.push({
        path: '/wcoin/goodsInfo',
        query: {
          id: id
        }
      })
    },
    // 删除
    deleteItem(id,index) {
      var params = {
        goodsId: id
      }
      var list=this.dataList;
      this.$http.post('/apis' + 'user_favourite/save.htm', this.Qs.stringify(params)).then(res => {
        if (res.retCode == 0) {
          //移除列表中下标为index的项
          list.splice(index, 1);
          this.dataList=list;
        } else if (res.retCode == "10002") {
          this.$router.replace({ path: '/wcoin/login' })
        }
      })
    },
    //获取收藏列表
    getList() {
      var params = {
        pageNum: this.pageNum
      }
      this.$http.post('/apis' + 'user_favourite/list.htm', this.Qs.stringify(params)).then(res => {
        if (res.retCode == 0) {
          console.log(res.data)
          if (res.data.length > 0) {
            this.dataList = this.dataList.concat(res.data);
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
    }
  }
}

</script>
<style scoped>

.main ul {
  padding: 10px 30px;
  height: 100%;
}

.list {
  height: 260px;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.16);
  margin-bottom: 30px;
}

.list>img {
  width: 260px;
  height: 260px;
}

.list-main {
  padding: 16px 30px 0;
  width: 430px;
}

.shop {
  width: 290px;
  border-bottom: 2px solid #eee;
  padding-bottom: 16px;
}

.shop .imgbox {
  width: 54px;
  height: 54px;
  display: inline-block;
  vertical-align: middle;
}

.shop img {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  margin-right: 20px;

  background-color: #fff;
}

.shop span {
  font-size: 24px;
  color: #999999;
  vertical-align: middle;
}
.del-box{
  display: inline-block;
}
.delete {
  width: 34px;
  height: 34px;
  margin-top: 14px;
}

main>p {
  font-size: 26px;
  color: #666666;
  margin-top: 25px;
  margin-bottom: 4px;
  height: 35px;
}

.red {
  font-size: 32px;
  color: #e50026;
  line-height: 45px;
  width: 180px;
}

.other-other {
}

.other-other span {
  font-size: 22px;
  color: #cccccc;
  line-height: 45px;
  border-left: 2px solid #eee;
  padding: 0 12px;
}

.other-other span:first-child {
  padding-left: 0;
  padding-right: 5px;
  border: 0;
}
.loadmore-container{
  top: 180px;
}
</style>
