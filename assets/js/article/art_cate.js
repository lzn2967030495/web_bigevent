$(function () {
    // 初始化文章分类列表
    initArtCateList()
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: "/my/article/cates",
            success: function (res) {
                // console.log(res);
                // 模板
                var htmlStr = template('tpl', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    // 给添加类别注册点击事件
    var layer = layui.layer
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            // 取消确定按钮
            type: 1,
            // 指定宽高
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })
    // 提交内容更新文章分类列表
    var indexAdd = null
    // 事件委托 监听文件上传
    $('body').on('submit', '#form-add', function (e) {
        // 阻止提交
        e.preventDefault()
        // 发起请求
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            // 获取值
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message, { icon: 5 })
                }
                // 重新渲染
                initArtCateList()
                layer.msg('恭喜您，文章类别添加成功！', { icon: 6 })
                // 关闭弹出层
                layer.close(indexAdd)
            }
        })
    })
    // 编辑表单
    var indexEdit = null
    var form = layui.form
    $('tbody').on("click", ".btn-edit", function () {
        // 利用框加代码，显示添加文章类别区域
        indexEdit = layer.open({
            // 取消确定按钮
            type: 1,
            // 指定宽高
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        // 获取id，发送ajax，渲染页面
        var Id = $(this).attr('data-Id')
        // console.log(Id);
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + Id,
            success: function (res) {
                // console.log(res);
                // 获取表单的值
                form.val('form-edit', res.data)
            }
        })
    })
    // 提交渲染
    $('body').on('submit', '#form-edit', function (e) {
        // 阻止提交
        e.preventDefault()
        // 发起请求
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            // 获取值
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message, { icon: 5 })
                }
                // 重新渲染
                initArtCateList()
                layer.msg('恭喜您，文章类别更新成功！', { icon: 6 })
                // 关闭弹出层
                layer.close(indexEdit)
            }
        })
    })
    // 删除 事件委托给删除按钮注册点击事件
    $('tbody').on("click", ".btn-delete", function (e) {
        // 获取id
        var id = $(this).attr('data-id')
        // 显示对话框
        // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！', { icon: 5 })
                    }
                    layer.msg('删除分类成功！', { icon: 6 })
                    layer.close(index)
                    initArtCateList()
                }
            })
        })
    })
})