var wcoinMobile = sessionStorage.getItem('wcoinMobile');
var global = {
    "wcoinMobile": ''
};
if (!!wcoinMobile) {
    sessionStorage.setItem('wcoinMobile', wcoinMobile);
    global.wcoinMobile = wcoinMobile;
}
export const globalData = global;