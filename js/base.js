// 公共脚本
$(function() {

    //页面布局
    setMain();
    $(window).resize(function(event) {
        setMain();
    });

    //数据
    setData(data);

    //上下收缩
    listSlider();
    //左右收缩
    packToggle();

    //加载页面
    loadHtml();
});

function setMain() {
    var _minWrap,_minWrapHeight,
        _minHeight = 600,
        _minWidth = 1000,
        _winWidth = $(window).width(),
        _winHeight = $(window).height();
    _winWidth>_minWidth?_minWrap=_winWidth:_minWrap=_minWidth;
    _winHeight>_minHeight?_minWrapHeight=_winHeight:_minWrapHeight=_minHeight;
    $(".wraper").height(_minWrapHeight);
    $(".main,.main-sidebar,.sidebar").height($(".wraper").height()-$(".header").outerHeight());
    $(".wraper,.header,.main").width(_minWrap);
    $(".header-main").width($(".header").width() - $(".logo").width());
    $(".main-wrapper").css({"left":$(".main-sidebar").width(),"min-height":$(".sidebar").height()});
}

function setData(data) {
    for (var i = 0; i < data.length; i++) {
        var tree = '<div class="menu">';
        if (data[i].children.length > 0) {
            tree += '<div class="menuTop">'
        } else {
            tree += '<div class="menuTop " href="' + data[i].href + '">'
        }
        tree += '<div class="transAnimate">';
        tree += '<span class="' + data[i].icon + '"></span>' +
            '<span class="menuName">' + data[i].name + '</span>' +
            '<span class="glyphicon glyphicon-menu-up ico pull-right"></span>' +
            '</div>' +
            '</div>' +
            '<ul class="dataBar list-unstyled">'
        for (var j = 0; j < data[i].children.length; j++) {
            var li = '<li class="treeview transAnimate" data="' + data[i].children[j].href + '">' +
                '<span class="glyphicon glyphicon-star"></span>' +
                '<span class="treeName">' + data[i].children[j].name + '</span>' +
                '</li>'
            tree += li
        }
        tree += '</ul>' +
            '</div>';
        $(".sidebar").append(tree);
    }
}

function listSlider() {
    $(".menuTop").eq(0).addClass('active').next(".dataBar").slideDown();
    $(".ico").first().attr("class", "glyphicon glyphicon-menu-down pull-right ico");
    $(".menuTop").on("click", function() {
        var display = $(this).siblings('.dataBar').css('display');
        if (display == "none") {
            $(this).children(".ico").attr("class", "glyphicon glyphicon-menu-down pull-right ico");
            $(this).parent().siblings('.menu').children('.menuTop').find(".ico").attr("class", "glyphicon glyphicon-menu-up pull-right ico");
        } else {
            $(this).children(".ico").attr("class", "glyphicon glyphicon-menu-down pull-right ico");
            $(this).parent().siblings('.menu').children('.menuTop').find(".ico").attr("class", "glyphicon glyphicon-menu-up pull-right ico")
        }
        $(this).parent().siblings(".menu").children('.dataBar').slideUp();
        $(this).next('.dataBar').slideDown();
        $(this).parent().siblings('.menu').children('.menuTop').removeClass('active');
        $(this).addClass('active');
        if ($(this).attr("href")) {
            //路径导航
            $('.remoteA').parent().show().next().show();
            $('.remoteA').text($(this).text());
            $('.remoteB').hide();

            //内容
            var path = $(this).attr("href");
            reading(path);
        }
    });
}

function reading(path) {
    $(".substance").empty();
    var tps = $("<div class='tps'><img src='./images/load.gif' />加载中...</div>");

    //加载中动画...
    $(".substance").append(tps);
    $(".tps").slideDown('slow', function() {
        addLoad(path);
    });
    //加载页面
    function addLoad(path) {
        $(".substance").load(path,
            function() {
                $(".tps").hide();
            });
    }
}

function packToggle() {
    var tag = 0;
    $(".sidebar-toggle").on('click', function(event) {
        if (tag % 2 == 0) {
            $(".logo-big").hide();
            $(".logo-mini").show();
            $(".sidebar").css({overflow:"inherit"});
            $(this).children('span').attr("class", "glyphicon glyphicon-align-left");
            $(".main-sidebar,.menu,.dataBar,.menuTop,.logo").width(60);
            $(".menuName,.dataBar,.ico").hide();
            $(".main-wrapper").css("left", $(".main-sidebar").width());
            $(".menuTop").unbind('click');
            $(".menuTop.active").removeClass('active');
            $(".menu").bind({
                mouseenter: function() {
                    $(this).width(227).children(".menuName").show();
                    $(this).children(".menuName").width(227).show();
                    $(this).children(".dataBar").show();
                    $(this).children(".dataBar").find(".treeview").width(130).css("margin-left", "60px");
                    $(this).children(".menuTop").width(227).find(".menuName").css("margin-left", "40px").show();
                    // $(this).children(".menuTop").width(227).find(".menuName").show();

                    $(this).siblings('.menu').width(57).children(".menuName").hide();
                    $(this).siblings('.menu').children(".menuName").width(60).hide();
                    $(this).siblings('.menu').children(".dataBar").hide();
                    $(this).siblings('.menu').children(".menuTop").width(57).find(".menuName").hide();
                    $(this).find(".dataBar.list-unstyled").css({
                        "position": "absolute",
                        "z-index": "-2"
                    });
                    $(".main-sidebar").css("z-index", "1042");
                    $(".menuTop").each(function(index, el) {
                        if ($(el).attr("href")){
                            $(el).css("border-radius", "0 5px 0 0").last().css("border-radius", "0 5px 5px 0");
                            $(el).click(function(event) {
                                $('.remoteA').parent().show().next().show();
                                $('.remoteA').text($(this).text());
                                $('.remoteB').hide();
                                var path = $(this).attr("href");
                                reading(path);
                            });
                        }else{
                            $(el).css("border-radius", "0 5px 0 0");
                        }
                    });

                    $(this).children().find(".treeview").last().css("border-radius", "0 0 5px");
                },
                mouseleave: function() {
                    $(this).width(60).children(".menuName").hide();
                    $(this).children(".menuName").width(60).hide();
                    $(this).children(".dataBar").hide();
                    $(this).children(".dataBar").children(".treeview").width(190).css("margin-left", "0px");
                    $(this).children(".menuTop").width(57).children(".menuName").css("margin-left", "5px").hide();
                    $(this).find(".dataBar.list-unstyled").css({
                        "position": "static",
                        "z-index": "auto"
                    });
                    $(".main-sidebar").css("z-index", "auto");
                    $(".menuTop").css("border-radius", "0");
                    $(this).children().find(".treeview").last().css("border-radius", "0");
                }
            });

        } else {
            $(".sidebar").css({overflow:"auto","overflow-x": "hidden"});
            $(".logo-big,.ico").show();
            $(".logo-mini").hide();
            $(this).children('span').attr("class", "glyphicon glyphicon-align-right");
            listSlider();
            $(".main-sidebar,.menu,.dataBar,.menuTop,.logo").width(227);
            $(".header-main").width($(window).width() - $(".logo").width());
            $(".menuName,.dataBar").show();
            $(".main-wrapper").css("left", $(".main-sidebar").width());
            $(".dataBar").hide();
            $(".treeview").width(190);

            $(".menuTop").removeClass('active');
            $(".ico").attr("class", "glyphicon glyphicon-menu-up ico pull-right");
            $(".treeview.act").parent(".dataBar").show().siblings('.menuTop').addClass('active').children(".ico").attr("class", "glyphicon glyphicon-menu-down ico pull-right");
            if (!$(".treeview").hasClass('act')) {
                $(".menuTop").eq(0).addClass('active').next(".dataBar").show();
                $(".menuTop.active").children(".ico").attr("class", "glyphicon glyphicon-menu-down pull-right ico");
            }
            $(".menuName").css("margin-left", "5px");
            $(".menu").unbind("mouseenter").unbind("mouseleave");
        }
        $(".header-main").width($(".header").width() - $(".logo").width());
        tag++;
    });
}

function loadHtml() {
    $('.remoteA').parent().hide().next().hide();
    $(".treeview").on("click", function() {
        $(this).siblings().removeClass('act');
        $(this).parent().parent(".menu").siblings().children(".dataBar").children(".treeview").removeClass('act');
        $(this).addClass('act');

        //路径导航
        $('.remoteA').parent().show().next().show();
        $('.remoteA').text($(this).parent().siblings().text());
        $('.remoteB').text($(this).text());

        //内容
        var path = $(this).attr("data");
        reading(path);
    });
}
