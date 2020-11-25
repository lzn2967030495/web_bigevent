// 入口函数
$(function () {
    // 1.点击去注册账号,隐藏去登录区域
    $('#link_reg').on('click', function () {
        $('.login_box').hide()
        $('.reg_box').show()
    })
    //点击去登录,隐藏去注册账号区域
    $('#link_login').on('click', function () {
        $('.reg_box').hide()
        $('.login_box').show()
    })

    // 2.自定义校验规则
    // 从layui中获取form对象
    var form = layui.form // layui-相当于jq中的$
    var layer = layui.layer //注册功能
    form.verify({
        // 密码规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        //确认密码规则
        repwd: function (value) {
            // value 确认密码的内容
            // pwd 密码的内容
            var pwd = $('.reg_box input[name=password]').val()
            //比较输入是否一致
            if (value !== pwd) {
                return "两次密码输入不一致！"
            }
        }
    })

    // 3.注册
    // 监听提交事件
    $('#form_reg').on('submit', function (e) {
        // 阻止提交
        e.preventDefault()
        // 发起请求
        $.ajax({
            method: 'POST',
            url: "/api/reguser",
            data: {
                username: $('.reg_box [name=username]').val(),
                password: $('.reg_box [name=password]').val()
            },
            success: function (res) {
                // console.log(res);
                //返回状态判断
                if (res.status !== 0) {
                    // return alert(res.message)
                    return layer.msg(res.message, { icon: 5 })
                }
                // alert("恭喜您，注册成功！")
                // 提交成功后处理
                layer.msg('注册成功，请登录!', { icon: 6 })
                // 手动切换登录表单
                $('#link_login').click()
                // 回车切换登录表单
                $('.layui-btn').on('keyup', function () {
                    if (keyCode === 13) {
                        $('#link_login').click()
                    }
                })
                //重置form表单
                $('#form_reg')[0].reset()
            }
        })
    })

    // 4.登录功能（给form标签绑定事件，btn按钮提交触发事件）
    $('#form_login').submit(function (e) {
        // 阻止默认提交
        e.preventDefault()
        // 发送ajax
        $.ajax({
            method: 'POST',
            url: "/api/login",
            data: $(this).serialize(), // 获取表单内的所有值
            success: function (res) {
                // 判断返回状态    
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 提示信息，保存token，跳转页面
                layer.msg('恭喜您，登录成功！', { icon: 6 })
                // 保存token，未来接口要使用token 本地存储值
                localStorage.setItem('token', res.token)
                // 跳转
                location.href = "/index.html"
            }
        })
    })

})