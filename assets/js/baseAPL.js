// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url

    // 对需要权限的接口进行配置
    // 以my开头的
    if (options.url.indexOf("/my/") !== -1) {
        options.headers = {
            Authorization: localStorage.getItem("token") || ""
        }
    }

    // 登录拦截
    options.complete = function (res) {
        // 请求失败且身份认证失败，强制清除本地存储tokne，并强制返回login.html
        // console.log(res);
        // 判断
        if (res.responseJSON.status !== 0 && res.responseJSON.message === "身份认证失败！") {
            // 清除tokne
            localStorage.removeItem("token")
            // 强制返回
            location.href = "/login.html"
        }
    }
})