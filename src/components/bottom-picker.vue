<template>
    <mt-popup v-model="toggle" :modal="modal" popup-transition="popup-fade" class="bottom-picker" position="bottom">
        <div class="bottom-picker-header" v-if="showHeader">

        </div>
        <ul class="bottom-picker-list">
            <li class="picker-list-item" v-for="item in dataList" @click="selectItem(item)">{{item.name}}</li>
        </ul>
        <div class="bottom-footer">
            
        </div>
    </mt-popup>
</template>

<script>
export default {
    props: {
        // 是否创建一个modal层
        modal: {
            type: Boolean,
            default: true
        },
        toggleShow: {
            type: Boolean,
            default: false
        },
        dataList: {
            type: Array,
            default: () => []
        },
        showHeader: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            toggle: this.toggleShow
        }
    },
    methods: {
        selectItem(item) {
            this.$emit('selectItem', item);
        }
    },
    watch: {
        toggleShow() {
            this.toggle = this.toggleShow
        }
    }
}
</script>

<style scoped>
.bottom-picker {
  width: 100%;
  background-color: #fff;
  text-align: center;
}
.picker-list-item {
  font-size: 36px;
  line-height: 110px;
  border-bottom: 2px solid #eeeeee;
}
.picker-list-item:last-child {
  border-bottom: 0;
}
</style>
