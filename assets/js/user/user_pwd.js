$(function () {
    // 自定义校验规则
    var form = layui.form
    form.verify({
        // 密码规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 新旧密码不能重复
        samePwd: function (value) { // value 获取新密码
            // console.log(value);
            if (value === $('[name=oldPwd]').val()) {
                return '新密码不能与旧密码一致!'
            }
        },
        // 确认密码相同
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码输入不一致!'
            }
        },
    })

    // 表单提交
    $('.layui-form').on('submit', function (e) {
        // 阻止提交
        e.preventDefault()
        $.ajax({
            method: 'POSt',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message, { icon: 5 })
                }
                layui.layer.msg('修改密码成功', { icon: 6 })
                // 修改后清空页面
                $('.layui-form')[0].reset()
                // 跳转到登录页面
                // window.parent.location.href = "/login.html"
            }
        })
    })
})