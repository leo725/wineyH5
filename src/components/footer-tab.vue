<template>
    <div class="tab">
        <router-link to="/wcoin/home" class="tab-item" :class="activeIndex==3?'active-tab':''">
            <img src="../assets/img/bar-home.png" alt="" class="normal">
            <img src="../assets/img/bar-home-a.png" alt="" class="active">
            <p>首页</p>
        </router-link>
        <router-link to="/wcoin/wcoin" class="tab-item" :class="activeIndex==3?'active-tab':''">
            <img src="../assets/img/bar-wcoin.png" alt="" class="normal">
            <img src="../assets/img/bar-wcoin-a.png" alt="" class="active">
            <p>Wcoin</p>
        </router-link>
        <div class="tab-item center-item" @click.stop="toggleShow=true">
            <img src="../assets/img/icon-add.png" alt="" class="add">
            <div class="fixed-box" v-show="toggleShow">
                <ul class="list">
                    <li>
                        <router-link to="/wcoin/myWine">
                            <img src="../assets/img/tab-exchange.png" alt="">
                            <p>红酒兑换</p>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/wcoin/sellWine">
                            <img src="../assets/img/tab-sell-wine.png" alt="">
                            <p>红酒出售</p>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/wcoin/transferAccounts">
                            <img src="../assets/img/tab-transfer.png" alt="">
                            <p>快速转账</p>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/wcoin/shortcutBuy">
                            <img src="../assets/img/tab-bay.png" alt="">
                            <p>Wcoin购买</p>
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{path:'/wcoin/wcoinSell',query:{type:'shortcut'}}">
                            <img src="../assets/img/tab-sell.png" alt="">
                            <p>Wcoin出售</p>
                        </router-link>
                    </li>
                </ul>
                <p class="close">
                    <img src="../assets/img/alert-close.png" alt="" @click.stop="toggleShow=false">
                </p>
            </div>
        </div>
        <router-link to="/wcoin/cart" class="tab-item" :class="activeIndex==3?'active-tab':''">
            <img src="../assets/img/bar-cart.png" alt="" class="normal">
            <img src="../assets/img/bar-cart-a.png" alt="" class="active">
            <p>购物车</p>
        </router-link>
        <router-link to="/wcoin/user" class="tab-item" :class="activeIndex==3?'active-tab':''">
            <img src="../assets/img/bar-user.png" alt="" class="normal">
            <img src="../assets/img/bar-user-a.png" alt="" class="active">
            <p>我的</p>
        </router-link>
    </div>
</template>

<script>
export default {
    props: {
        activeIndex: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            toggleShow: false
        }
    }
}
</script>

<style scoped>
.tab {
  position: fixed;
  z-index: 999;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 120px;
  background-color: #fff;
  border-top: 1px solid #eeeeee;
}
.tab-item {
  width: 20%;
  height: 100%;
  display: block;
  float: left;
  text-align: center;
  line-height: 0;
}
.tab-item img {
  width: 51px;
  margin-top: 17.5px;
}
.normal {
  display: inline-block;
}
img.active {
  display: none;
}
.tab-item p {
  font-size: 24px;
  color: #ccc;
  margin-top: 8px;
}
.center-item {
  background-color: #e50026;
  text-align: center;
}
.tab-item.router-link-exact-active p,
.tab-item.active-tab p {
  color: #666666;
}
.tab-item.router-link-exact-active .active,
.tab-item.active-tab .active {
  display: inline-block;
}
.tab-item.router-link-exact-active .normal,
.tab-item.active-tab .normal {
  display: none;
}
.center-item .add {
  margin-top: 36px;
}
.fixed-box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.98);
  z-index: 1000;
}
.list {
  position: absolute;
  overflow: hidden;
  bottom: 172px;
}
.list li {
  float: left;
  width: 140px;
  margin-left: 86px;
  text-align: center;
  margin-top: 79px;
}
.list li img {
  width: 120px;
  height: 120px;
  margin-bottom: 10px;
}
.list li p {
  font-size: 28px;
  color: #999999;
  text-align: center;
}
.close {
    text-align: center;
    position: absolute;
    bottom: 25px;
    left: 0;
    right: 0;
}
.close img{
    width: 70px;
    height: 70px;
}
</style>
