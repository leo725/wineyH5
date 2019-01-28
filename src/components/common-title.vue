<template>
    <div class="common-title">
        <div class="title between" :class="hasLine?'hasline':''">
            <div>
                <p :style="{color:fontsColor}">{{title}}</p>
                <span v-if="subText" :style="{color:fontsColor}">{{subText}}</span>
            </div>
            <div v-if="!!btnText" class="add" @click="clickFun">{{btnText}}</div>
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        // 标题
        title: {
            type: String,
            default: ''
        },
        // 按钮文字
        btnText: {
            type: String,
            default: ''
        },
        // 子标题
        subText: {
            type: String,
            default: ''
        },
        // 是否有彩色线条
        hasLine: {
            type: Boolean,
            default: false
        },
        // 字体颜色
        fontsColor: {
            type: String,
            default: ''
        }
    },
    methods: {
        clickFun() {
            this.$emit('clickFun')
        }
    }
}
</script>

<style scoped>
.title {
  padding-top: 61px;
  padding-bottom: 60px;
  position: relative;
  margin-left: 40px;
}
.title p {
  font-size: 54px;
  color: #000000;
}
.title span {
  font-size: 32px;
  color: #999999;
  margin-top: 8px;
  display: block;
  padding-right: 40px;
}
.hasline {
  margin-bottom: 39px;
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
.hasline::after {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 22px;
  content: "";
  height: 2px;
  background: url(../assets/img/add-line.png) no-repeat;
  background-size: 100%;
}
</style>
