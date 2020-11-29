$(function () {

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义参数
    var q = {
        pagenum: 1, // 页面值
        pagesize: 2, // 每页显示数据
        cate_id: '', // 文章分类的id
        state: '', // 文章的状态 已发布/草稿
    }

    // 初始化文章列表
    initTable()
    function initTable() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败!', { icon: 5 })
                }
                // 使用模板引擎渲染页面
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用分页
                renderPage(res.total)

            }
        })
    }

    // 初始化分类
    var form = layui.form
    initCate()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: "/my/article/cates",
            success: function (res) {
                // 校验
                if (res.status !== 0) {
                    return layer.msg(res.message, { icon: 5 })
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    // 筛选功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取
        var state = $('[name=state]').val()
        var cata_id = $('[name=cate_id]').val()
        // 赋值
        q.state = state
        q.cata_id = cata_id
        // 初始化文章列表
        initTable()
    })

    // 分页
    var laypage = layui.laypage;
    function renderPage(total) {
        // console.log(total);
        laypage.render({
            elem: 'pageBox',// 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页

            // 分页模块设置 显示哪些子模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10], // 每页显示多少条数据选择器
            // 触发jump：分页初始化的时候，页码改变的时候
            jump: function (obj, first) {
                // obj 所有的参数所在的对象 first:是否第一次初始化分页
                // 改变当前页
                // console.log(obj);
                // console.log(first);
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                // 判断，不是第一次初始化分页，才能重新调用初始化文章列表
                if (!first) {
                    // 初始化文章列表
                    initTable()
                }
            }
        });
    }

    // 删除功能
    var layer = layui.layer
    $('tbody').on('click', '.btn-del', function () {
        var len = $('.btn-del').length
        console.log(len);
        // 先获取id 函数内部会更改this指向
        var Id = $(this).attr('data-Id')
        // 显示对话框
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            // 发送ajax请求
            $.ajax({
                method: 'GET',
                url: "/my/article/delete/" + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了,则让页码值 -1 之后,
                    // 再重新调用 initTable 方法
                    // 4
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                    layer.msg(res.message)
                }
            })
            layer.close(index);
        });
    })
})