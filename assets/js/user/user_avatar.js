$(function () {

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')

    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 选择头像
    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })

    // 渲染头像 文件显示
    var layer = layui.layer
    $('#file').on('change', function (e) {
        //  1. 拿到用户输入的文件
        var file = e.target.files[0]
        // console.log(file);
        // 非空校验
        if (file == undefined) {
            return layer.msg('请选择图片!')
        }
        // 2. 将文件，转化为路径
        var imgURL = URL.createObjectURL(file)
        // 3. 重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 上传头像
    $('#btnUpload').on('click', function () {
        // 获取base64类型的头像(字符串)
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')
        console.log(dataURL);
        console.log(typeof dataURL);
        // 发送ajax
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败!', { icon: 5 })
                }
                layer.msg('更换头像成功!', { icon: 6 })
                window.parent.getUserInof()
            }
        })
    })
})