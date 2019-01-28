<template>
<div class="container">
  <common-title :title="isSelectAdd?'取件地址':'收货地址'" btn-text="添加" :has-line='true' @clickFun='addAddress(1,"")'></common-title>
  <div class="loadmore-container">
    <mt-loadmore :bottom-method="getAddress" ref="loadmore" :bottom-all-loaded="noMoerData" :bottom-pull-text="noMoerData?'没有更多数据':'加载更多'">
      <ul class="list-box">
        <li class="list" v-for="item in AddressList" @click="selectItem(item)">
          <p class="top">
            <span class="name">{{item.nickName}}</span>
            <span class="tel">{{item.phone}}</span>
          </p>
          <div class="main between">
            <div class="address">
              <span class="default" v-if="item.isDefault=='y'">默认</span> {{item.provinceName}}{{item.cityName}}{{item.areaName}}{{item.address}}
            </div>
            <img src="../../assets/img/icon-edit.png" class="edit" alt="" @click.stop='addAddress(2,item.id,item)'>
          </div>
        </li>
      </ul>
    </mt-loadmore>
  </div>

</div>
</template>

<script>
import commonTitle from '@/components/common-title';
export default {
  components: {
    commonTitle
  },
  data() {
    return {
      pageNum: 0,
      noMoerData: false,
      AddressList: [],
      isSelectAdd: this.$route.query.selectAdd
    }
  },
  created() {
    this.getAddress();
  },
  mounted() {

  },
  methods: {
    // 添加收货地址
    addAddress(type, id, item) {
      sessionStorage.setItem("addrssList", JSON.stringify(item));
      this.$router.push({
        path: '/wcoin/addAddress',
        query: {
          type: type,
          id: id
        }
      })
    },
    // 选择收货地址
    selectItem(item) {
      if(this.isSelectAdd){
        sessionStorage.setItem('selectedAddress',JSON.stringify(item));
        this.$router.back(-1)
      }
    },
    //获取收货地址
    getAddress() {
      var params = {
        pageNum: this.pageNum
      }
      this.$http.post('/apis' + 'user_address/list.htm', this.Qs.stringify(params)).then(res => {
        if (res.retCode == 0) {
          if (res.data.length > 0) {
            this.AddressList = this.AddressList.concat(res.data);
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
.title {
  padding-top: 61px;
  padding-bottom: 39px;
  position: relative;
}

.title p {
  font-size: 54px;
  color: #000000;
}

.title .add {
  height: 66px;
  width: 128px;
  text-align: center;
  color: #fff;
  background: #e50026;
  line-height: 66px;
  margin-right: 40px;
  position: relative;
  top: 4px;
  font-size: 32px;
}

.title::after {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 22px;
  content: "";
  height: 2px;
  background: url(../../assets/img/add-line.png) no-repeat;
  background-size: 100%;
}

.list-box {
  padding-left: 60px;
}

.list {
  border-bottom: 2px solid #eee;
  padding: 30px 0;
  padding-right: 40px;
}

.name,
.tel {
  font-size: 32px;
  color: #000000;
}

.name {
  margin-right: 20px;
}

.main {
  margin-top: 10px;
}

.address {
  width: 580px;
  font-size: 32px;
  color: #999;
  line-height: 48px;
}

.default {
  display: inline-block;
  width: 78px;
  height: 38px;
  border: 2px solid #e50026;
  font-size: 26px;
  text-align: center;
  color: #e50026;
}

.edit {
  width: 32px;
  height: 32px;
}
.common-title{
  top: 0;
  left: 0;
  position: fixed;
  width: 100%;
}
</style>
