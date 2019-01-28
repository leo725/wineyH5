<template>
<div class="scroll-nav" id="scroll-nav">
    <ul class="nav-box" ref="navbox" :class="hasLine?'has-bottom':''">
        <li ref="scrollNavItem" :class="item.id == active?'active':''||item.typeId == active?'active':''" @click="changeNav(item)" :style="{'margin-right':interval==0?'':interval+'px'}" v-for="item in dataList">{{item.classifyName}}</li>
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
        hasLine: {
            type: Boolean,
            default: true
        },
        interval: {
            type: Number,
            default: 0
        },
        activeId: {
            default: ''
        }
    },
    data() {
        return {
            active: this.activeId ? this.activeId : this.dataList.length > 0 && !!this.dataList[0].id ? this.dataList[0].id : this.dataList.length > 0 && this.dataList[0].typeId ? this.dataList[0].typeId : ''
        }
    },
    mounted(){
        var scrollToLeft=0;
        var scrollNavItem=this.$refs.scrollNavItem;
        for (let i = 0; i < this.dataList.length; i++) {
            if(this.dataList[i].id==this.active){
                this.$refs.navbox.scrollLeft = scrollToLeft;
                break;
            }
            scrollToLeft +=scrollNavItem[i].offsetWidth + parseFloat(scrollNavItem[i].style.marginRight);
        }
    },
    methods: {
        changeNav(item) {
            this.active = !!item.id ? item.id : item.typeId;
            this.$emit('changeScrollNav', item)
        }
    }
}
</script>
<style scoped>
.scroll-nav {
    width: 100%;
    overflow-y: visible;
}

.nav-box {
    font-size: 0;
    vertical-align: middle;
    overflow-x: auto;
    white-space: nowrap;
    transition: scrollLeft linear 1s;
    overflow-y: visible;
    /* height: 7px; */
}

.nav-box li {
    font-size: 30px;
    display: inline-block;
    vertical-align: text-bottom;
    margin-right: 50px;
    position: relative;
    cursor: pointer;
    color: #999;
    height: 60px;
    overflow: hidden;
}

.nav-box li:last-child {
    margin-right: 0 !important;
}

.nav-box li.active {
    color: #333;
}

.has-bottom li::after {
    width: 0px;
    position: absolute;
    content: "";
    height: 6px;
    background-color: #333333;
    bottom: 0px;
    left: 50%;
    margin-left: 0px;
    z-index: 2;
}

.has-bottom li.active::after {
    width: 100%;
    left: 0;
    transition: all ease-in-out 0.3s;
}
</style>

