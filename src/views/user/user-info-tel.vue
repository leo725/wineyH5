<template>
    <div class="container">
        <common-title title="绑定手机号" :sub-text="'当前手机号：'+ mobileNo"></common-title>
        <div class="main">
            <div class="has-tel">
                <router-link :to="{path:'/wcoin/changeTel',query:{mobileNo:mobileNo}}" replace class="common-btn">
                    更换手机号
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import commonTitle from '@/components/common-title'
export default {
    data() {
        return {
            mobileNo: this.$route.query.mobileNo
        }
    },
    components: { commonTitle },
    methods: {

    }
}
</script>

<style scoped>
.main {
  padding-left: 40px;
}
</style>
