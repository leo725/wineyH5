// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'lib-flexible/flexible.js'
// mint-ui 
import Mint from 'mint-ui';
import { Toast, Indicator } from 'mint-ui';
import 'mint-ui/lib/style.css'
Vue.use(Mint);

// 按需引入element-ui 组件
import { Upload } from 'element-ui';
Vue.use(Upload)

// axios
import Qs from 'qs'
import axios from "axios"
// 公共样式
import '@/assets/style/common.css';

// 全局变量
import { globalData } from '@/assets/js/global'

Vue.config.productionTip = false
Vue.prototype.$http = axios;
Vue.prototype.Qs = Qs;
Vue.prototype.globalData = globalData
Vue.prototype.baseApi = 'http://wechatwinery.kuangyeipfs.org/';

// Axios 请求拦截器
axios.interceptors.request.use(function(config) {
    // 在发送请求之前做些什么
    Indicator.open('加载中...');
    return config;
}, function(error) {
    // 对请求错误做些什么
    Toast({
        message: "请求过程中发生了错误",
        duration: 1200,
        className: 'error'
    });
    console.log("请求过程发生的错误消息：" + error);
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function(response) {
    Indicator.close();
    // 对响应数据做点什么
    try {
        if (!response.data.retCode) {
            if (response.request.responseURL.indexOf('alioss') < 0) {
                Toast({
                    message: "数据异常",
                    duration: 1200,
                    className: 'error'
                });
            }
        } else if (response.data.retCode == '30005') {
            // 账号被冻结 跳到登录页
            Toast({
                message: response.data.errorMsg,
                duration: 2000,
                className: 'error'
            });
            router.replace('/wcoin/login')
        } else if (response.data.retCode != '10002' && response.data.retCode != 0) {
            Toast({
                message: response.data.errorMsg,
                duration: 1200,
                className: 'error'
            });
        }
    } catch (e) {
        Toast({
            message: "处理返回的数据发生异常",
            duration: 1200,
            className: 'error'
        });
    }
    return response.data;
}, function(error) {
    // 对响应错误做点什么
    Indicator.close();
    Toast({
        message: "服务器连接异常,请稍后再试",
        duration: 1200,
        className: 'error'
    });
    // Toast("返回数据过程中发生了错误~");
    console.log("错误消息：" + error);
    return Promise.reject(error);
});

// 路由拦截写这里
// router.beforeEach((to, from, next) => {
//     //如果未匹配到路由
//     if (to.matched.length <= 0) {
//         //如果上级也未匹配到路由则跳转登录页面，如果上级能匹配到则转上级路由
//         from.name ? next({ name: from.name }) : next('/');
//     } else {
//         next();
//     }
// })

// 过滤器
import * as myFilter from './assets/js/filter'

Object.keys(myFilter).forEach(key => {
    Vue.filter(key, myFilter[key])
})

// 全局方法
import validate from './assets/js/validate'
Vue.use(validate);

// 指令
import { numberOnly } from './assets/js/directive'

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})