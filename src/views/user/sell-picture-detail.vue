<template>
<div class="container">
    <common-title :title="type==1?'封面图':type==2?'图文详情图':'产品参数图'"></common-title>
    <div class="main">
        <ul class="list">
            <li class="img-box" v-for="(item,index) in sellWineImgs">
                <img :src="item.url" alt="">
                <img class="delete" src="../../assets/img/icon-delete.png" alt="" @click="deleteItem(index)">
            </li>
            <li class="img-box upload" v-if="type==1 || sellWineImgs.length<6?true:false">
                <upload accept="image/*" :multiple="false" class="upload" @uploadSuccess="uploadSuccess">
                    <img src="../../assets/img/camera1.png" slot alt="">
                </upload>
            </li>
        </ul>
    </div>
</div>
</template>

<script>
import commonTitle from '@/components/common-title'
import upload from '@/components/upload'
export default {
    data() {
        return {
            type: this.$route.query.type,
            fileList: [],
            sellWineImgs: [],
            sellWineObj: JSON.parse(sessionStorage.getItem('sellWineObj'))
        }
    },
    components: {
        commonTitle,
        upload
    },
    created() {
        // var sellWineObj = JSON.parse(sessionStorage.getItem('sellWineObj'));
        this.sellWineImgs = this.sellWineObj['imgArr' + this.type]
    },
    methods: {
        // 上传成功
        uploadSuccess(res) {
            if (this.type == 1) {
                this.sellWineImgs = [res];
            } else {
                this.sellWineImgs.push(res);
            }
            this.setSessionStorage();
        },
        // 删除图片
        deleteItem(index) {
            this.sellWineImgs.splice(index, 1);
            this.setSessionStorage();
        },
        // 设置本地缓存
        setSessionStorage() {
            this.sellWineObj['imgArr' + this.type] = this.sellWineImgs;
            sessionStorage.setItem('sellWineObj', JSON.stringify(this.sellWineObj))
        }
    }

}
</script>

<style scoped>
.main {
    padding-left: 20px;
}

.list {
    overflow: hidden;
}

.img-box {
    margin-left: 20px;
    width: 210px;
    height: 210px;
    float: left;
    margin-bottom: 20px;
    position: relative;
}

.img-box>img,
.upload img {
    width: 210px;
    height: 210px;
}

.img-box .delete {
    width: 40px;
    height: 40px;
    position: absolute;
    top: 0;
    right: 0;
}
</style>
