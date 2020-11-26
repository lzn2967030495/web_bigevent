$(function () {
    var form = layui.form
    // 校验昵称
    form.verify({
        nickname: function (value) { // value 获取昵称
            if (value.length > 6) {
                return '昵称长度为2~6位之间'
            }
        }
    })
    // 用户信息渲染调用
    initUserInfo()
    // 用户信息渲染
    var layer = layui.layer
    function initUserInfo() {
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败!')
                }
                // 获取成功-赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 表单重置
    $('#btnReset').on('click', function (e) {
        // 阻止默认清空内容
        e.preventDefault()
        // 重新渲染
        initUserInfo()
    })

    // 修改用户信息
    $('.layui-form').on('submit', function (e) {
        // e.阻止提交
        e.preventDefault()
        // 发送ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('用户信息修改失败!', { icon: 5 })
                }
                layer.msg('恭喜您,用户信息修改成功!', { icon: 6 })
                // 调用父页面种的渲染头像信息和昵称
                window.parent.getUserInof()
            }
        })
    })
})