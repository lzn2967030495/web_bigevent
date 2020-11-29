$(function () {

    var layer = layui.layer
    var form = layui.form

    // 加载筛选框内容
    initCate()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: "/my/article/cates",
            success: function (res) {
                // console.log(res);
                // {status: 0, message: "获取文章分类列表成功！", data: Array(7)}
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 渲染模板
                var html = template('tpl-cate', res)
                $('[name=cate_id]').html(html)
                form.render()
            }
        })
    }

    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面的按钮绑定点击事件
    $('#btn_Add').on('click', function () {
        $('#file').click()
    })

    // 设置图片
    $('#file').change(function (e) {
        // 拿到用户选择文件
        var file = e.target.files[0]
        // 非空校验
        if (file == undefined) {
            return
        }
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)
        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 设置状态
    var art_state = '已发布'
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    // 添加文章
    $('#form-pub').on('submit', function (e) {
        // 阻止默认提交
        e.preventDefault()
        // 创建form表单
        var fd = new FormData($(this)[0])
        // 将文章的发布状态，存到 fd 中
        fd.append('state', art_state)
        // 放入图片
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })
    })

    // 发起Ajax请求实现发布文章的功能
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                // 发布文章成功后，跳转到文章列表页面
                // location.href = '/article/art_list.html'
                setTimeout(function () {
                    window.parent.document.getElementById('art_list').click()
                }, 500)
            }
        })
    }
})