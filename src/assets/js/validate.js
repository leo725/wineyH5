exports.install = function(Vue, options) {
    Vue.prototype.validate = function(type, val) {
        // 正则校验字符串
        var reg;
        switch (type) {
            // 邮箱
            case 'email':
                reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
                break;
                // 手机号
            case 'mobile':
                reg = /^[1][3,4,5,7,8][0-9]{9}$/;
                break;
                // 身份证 15/18位
            case 'idCard':
                reg = /(^\d{15}$)|(^\d{17}([0-9]|X|x)$)/;
                break;
                // 密码 必须包含大小写字母和数字的组合，不能使用特殊字符，长度在8-10之间
            case 'password':
                reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$ /;
                break;
                // 汉字
            case 'chinese':
                reg = /^[\u4e00-\u9fa5]{0,}$/;
                break;
                // bank  银行卡
            case 'bankCard':
                reg = /^([1-9]{1})(\d{15}|\d{18})$/;
                break;
                //正整数
            case 'Int':
                reg = /^[1-9]d*$/;
                break;
                // 4位数字
            case 'code4':
                reg = /^\d{4}$/;
                break;
        }
        if (!val) {
            return false;
        } else {
            return reg.test(val)
        }
    };
};