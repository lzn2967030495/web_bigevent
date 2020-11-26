//入口函数
$(function () {
    // 获取用户信息
    getUserInof()

    // 退出
    var layer = layui.layer
    $('#btnOut').on('click', function () {
        layer.confirm('是否确认退出?', { icon: 3, title: '提示' }, function (index) {
            // 清空本地存储
            localStorage.removeItem('token')
            // 页面跳转
            location.href = "/login.html"
            // 关闭询问框
            layer.close(index);
        });
    })
})

// 获取用户信息 写在入口函数外面用于其他页面调用
function getUserInof() {
    // 发送ajax
    $.ajax({
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem("token") || ""
        // },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            // 请求成功
            renderAvatar(res.data)
        }
    })
}

// 渲染用户头像
function renderAvatar(user) {
    // 用户名
    var name = user.nickname || user.username
    $("#welcome").html("欢迎&nbsp;&nbsp" + name)
    // 用户头像
    if (user.user_pic !== null) {
        // 有头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 没有头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}