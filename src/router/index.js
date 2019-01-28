import Vue from 'vue'
import Router from 'vue-router'
// 前缀    wcoin
/**************************其他页面****************************/
import login from '@/views/other/login' // 登录

/**************************首页****************************/
import home from '@/views/home/home' // 首页
import homeSearch from '@/views/home/search' // 首页搜索
import goodsInfo from '@/views/home/goods-info' // 商品详情
import paySuccess from '@/views/home/pay-success' // 购买成功
import leaveWord from '@/views/home/leave-word' // 留言
import reply from '@/views/home/reply' // 发布，回复留言
/**************************Wcoin****************************/
import wcoin from '@/views/wcoin/wcoin' // wcoin 
import shortcutBuy from '@/views/wcoin/shortcut-buy' // 快捷购买
import commonBuy from '@/views/wcoin/common-buy' // wcoim购买
import wcoinSell from '@/views/wcoin/wcoin-sell' // wcoin 出售
import orderForm from '@/views/wcoin/order-form' // 订单支付
import orderResult from '@/views/wcoin/order-result' // 订单结果
import transaction from '@/views/wcoin/transaction' // 交易记录
import buyInfo from '@/views/wcoin/buy-info' // 购买详情
import sellInfo from '@/views/wcoin/sell-info' // 出售详情
import dealInfo from '@/views/wcoin/deal-info' // 红酒币交易详情


/**************************购物车****************************/
import cart from '@/views/cart/cart' // 购物车
import tradeSuccess from '@/views/cart/trade-success' // 购物车-支付成功
/**************************我的****************************/
import user from '@/views/user/user' // 我的
import myAddress from '@/views/user/my-address' // 我的收货地址
import myCard from '@/views/user/my-card' // 我的银行卡
import setting from '@/views/user/setting' // 设置
import userInfo from '@/views/user/user-info' // 个人信息
import nickName from '@/views/user/nick-name' // 设置昵称
import addAddress from '@/views/user/add-address' // 添加地址
import setPayPwd from '@/views/user/set-pay-pwd' // 设置支付密码
import transferAccounts from '@/views/user/transfer-accounts' // 快速转账
import transferCurrency from '@/views/user/transfer-currency' // 快速转账页面2
import transferRecord from '@/views/user/transfer-record' // 转账记录
import certification from '@/views/user/certification' // 实名认证
import certificationIdCard from '@/views/user/certification-idcard' // 实名认证 - 上传身份证
import messageCenter from '@/views/user/message-center' // 消息中心
import transferMessage from '@/views/user/transfer-message' // 转账通知
import transferDetail from '@/views/user/transfer-detail' // 转账详情
import myWine from '@/views/user/my-wine' // 我的红酒
import conversionRecord from '@/views/user/conversion-record' // 兑换记录
import userInfoTel from '@/views/user/user-info-tel' // 绑定手机号
import changeTel from '@/views/user/change-tel' // 更改、绑定手机号
import orderInfo from '@/views/user/order-info' // 订单详情
import sellWine from '@/views/user/sell-wine' // 我要出售
import sellPictureDetail from '@/views/user/sell-picture-detail' // 出售 图文详情
import transferSuccess from '@/views/user/transfer-success' // 转账结果
import wineInfo from '@/views/user/wine-info' // 兑换红酒详情
import myPublish from '@/views/user/my-publish' // 我的发布
import mySell from '@/views/user/my-sell' // 我的卖出
import myCollect from '@/views/user/my-collect' // 我的收藏
import addBankCard from '@/views/user/add-bank-card' // 添加银行卡
import writeOrder from '@/views/user/write-order' // 兑换红酒-填写订单
import changePayPwd from '@/views/user/change-pay-pwd' // 修改支付密码
import paySecurityCode from '@/views/user/pay-security-code' // 设置支付密码 验证码
import shipments from '@/views/user/shipments' // 发货
import mailInfo from '@/views/user/mail-info' // 填写寄件信息
import mailDetail from '@/views/user/mail-detail' // 寄件详情
import feedback from '@/views/user/feedback' // 意见反馈
import logistics from '@/views/user/logistics' // 物流消息
import publishInfo from '@/views/user/publish-info' // 发布详情-卖家留言的地方
import sellOrderInfo from '@/views/user/sell-order-info' // 我卖出的-订单详情


Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [{
            path: '/',
            redirect: '/wcoin/home'
        },
        /**************************其他页面****************************/
        {
            path: '/wcoin/login',
            component: login
        },
        /**************************首页****************************/
        // 首页
        {
            path: '/wcoin/home',
            component: home
        },
        // 首页搜索
        {
            path: '/wcoin/homeSearch',
            component: homeSearch
        },
        // 商品详情
        {
            path: '/wcoin/goodsInfo',
            component: goodsInfo
        },
        // 购买成功
        {
            path: '/wcoin/paySuccess',
            component: paySuccess
        },
        // 留言
        {
            path: '/wcoin/leaveWord',
            component: leaveWord
        },

        // 发布，回复留言
        {
            path: '/wcoin/reply',
            component: reply
        },
        /**************************Wcoin****************************/
        // Wcoin
        {
            path: '/wcoin/wcoin',
            component: wcoin
        },
        // 快捷购买
        {
            path: '/wcoin/shortcutBuy',
            component: shortcutBuy
        },
        // wcoin购买
        {
            path: '/wcoin/commonBuy',
            component: commonBuy
        },
        // wcoin 出售
        {
            path: '/wcoin/wcoinSell',
            component: wcoinSell
        },
        // 订单支付
        {
            path: '/wcoin/orderForm',
            component: orderForm
        },
        // 订单结果
        {
            path: '/wcoin/orderResult',
            component: orderResult
        },
        // 交易记录
        {
            path: '/wcoin/transaction',
            component: transaction
        },
        // 购买详情
        {
            path: '/wcoin/buyInfo',
            component: buyInfo
        },
        // 出售详情
        {
            path: '/wcoin/sellInfo',
            component: sellInfo
        },
        // 红酒币交易详情
        {
            path: '/wcoin/dealInfo',
            component: dealInfo
        },
        /**************************购物车****************************/
        // 购物车
        {
            path: '/wcoin/cart',
            component: cart
        },

        {
            path: '/wcoin/tradeSuccess',
            component: tradeSuccess
        },
        /**************************我的****************************/
        // 我的
        {
            path: '/wcoin/user',
            component: user
        },
        // 我的收货地址
        {
            path: '/wcoin/myAddress',
            component: myAddress
        },
        // 添加地址
        {
            path: '/wcoin/addAddress',
            component: addAddress
        },
        // 我的银行卡
        {
            path: '/wcoin/myCard',
            component: myCard
        },
        // 设置
        {
            path: '/wcoin/setting',
            component: setting
        },
        // 个人信息
        {
            path: '/wcoin/userInfo',
            component: userInfo
        },
        // 设置昵称
        {
            path: '/wcoin/nickName',
            component: nickName
        },
        // 设置支付密码
        {
            path: '/wcoin/setPayPwd',
            component: setPayPwd
        },
        // 快速转账
        {
            path: '/wcoin/transferAccounts',
            component: transferAccounts
        },
        // 快速转账页面2
        {
            path: '/wcoin/transferCurrency',
            component: transferCurrency
        },
        // 转账记录
        {
            path: '/wcoin/transferRecord',
            component: transferRecord
        },
        // 实名认证
        {
            path: '/wcoin/certification',
            component: certification
        },
        // 实名认证 上传身份证
        {
            path: '/wcoin/certificationIdCard',
            component: certificationIdCard
        },
        // 消息中心
        {
            path: '/wcoin/messageCenter',
            component: messageCenter
        },
        // 转账通知
        {
            path: '/wcoin/transferMessage',
            component: transferMessage
        },
        // 我的红酒
        {
            path: '/wcoin/myWine',
            component: myWine
        },
        // 兑换记录 
        {
            path: '/wcoin/conversionRecord',
            component: conversionRecord
        },
        // 转账详情
        {
            path: '/wcoin/transferDetail',
            component: transferDetail
        },
        // 绑定手机号
        {
            path: '/wcoin/userInfoTel',
            component: userInfoTel
        },
        // 更改，绑定手机号
        {
            path: '/wcoin/changeTel',
            component: changeTel
        },
        // 出售红酒
        {
            path: '/wcoin/sellWine',
            component: sellWine
        },
        // 订单详情
        {
            path: '/wcoin/orderInfo',
            component: orderInfo
        },
        // 出售图文详情
        {
            path: '/wcoin/sellPictureDetail',
            component: sellPictureDetail
        },
        //转账结果
        {
            path: '/wcoin/transferSuccess',
            component: transferSuccess
        },
        //兑换红酒详情
        {
            path: '/wcoin/wineInfo',
            component: wineInfo
        },
        //我的发布
        {
            path: '/wcoin/myPublish',
            component: myPublish
        },
        //我卖出的
        {
            path: '/wcoin/mySell',
            component: mySell
        },
        //我的收藏
        {
            path: '/wcoin/myCollect',
            component: myCollect
        },
        //添加银行卡
        {
            path: '/wcoin/addBankCard',
            component: addBankCard
        },
        //兑换红酒-填写订单
        {
            path: '/wcoin/writeOrder',
            component: writeOrder
        },
        //修改支付密码
        {
            path: '/wcoin/changePayPwd',
            component: changePayPwd
        },
        //修改支付密码 -- 验证码
        {
            path: '/wcoin/paySecurityCode',
            component: paySecurityCode
        },
        // 发货
        {
            path: '/wcoin/shipments',
            component: shipments
        },
        // 填写寄件信息
        {
            path: '/wcoin/mailInfo',
            component: mailInfo
        },
        // 寄件详情
        {
            path: '/wcoin/mailDetail',
            component: mailDetail
        },
        // 意见反馈
        {
            path: '/wcoin/feedback',
            component: feedback
        },
        // 物流消息
        {
            path: '/wcoin/logistics',
            component: logistics
        },
        //发布详情
        {
            path: '/wcoin/publishInfo',
            component: publishInfo
        },
        // 我卖出的-订单详情
        {
            path: '/wcoin/sellOrderInfo',
            component: sellOrderInfo
        },
        {
            path: "*",
            redirect: "/wcoin/home"
        }
    ]
})