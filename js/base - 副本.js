// 公共脚本
$(function(){
    $("body").perfectScrollbar();
    // $(".main-wrapper").perfectScrollbar();
    setMain();
    $(window).resize(function(event) {
        setMain();
    });
    //数据
    setData();
    //上下收缩
    listSlider();
    //左右收缩
    packToggle();
    //加载页面
    loadHtml();

});
function setMain(){

    $(".header-main").width($(window).width()-$(".logo").width());
    $(".main-wrapper").css("left",$(".main-sidebar").width());
    $(".main-wrapper").css("min-height",$(".sidebar").height());
    $(".user-info").hide();
    $(".main").on("click",function(){
        $(".user-info").slideUp();
    });
    var num = 0;
    $(".userBen").on("click",function(){
        if(num%2==0){
            $(".user-info").slideDown();
        }else{
            $(".user-info").slideUp();
        }
        num++;
    });
}
function setData(){
    var data = [{id:1,name:"页面展示",icon:"glyphicon glyphicon-home",children:[{name:"列表",href:"./pages/list.html",icon:"glyphicon glyphicon-list-alt"},{name:"表单",href:"./pages/form.html",icon:"glyphicon glyphicon-list-alt"}]},{id:1,name:"页面设置",icon:"glyphicon glyphicon-cog",children:[{name:"列表",href:"./pages/list.html",icon:"glyphicon glyphicon-list-alt"},{name:"表单",href:"./pages/form.html",icon:"glyphicon glyphicon-list-alt"}]},{id:1,name:"系统管理",icon:"glyphicon glyphicon-cog",children:[{name:"列表",href:"./pages/list.html",icon:"glyphicon glyphicon-list-alt"},{name:"表单",href:"./pages/form.html",icon:"glyphicon glyphicon-list-alt"}]}];

}
function listSlider(){
    $(".menuTop").eq(0).addClass('active').next(".dataBar").slideDown();
    $(".menuTop").on("click",function(){
        // var icoClass = $(this).children(".ico").hasClass('glyphicon glyphicon-menu-up');
        var display = $(this).siblings('.dataBar').css('display');
        if(display=="none"){
            $(this).children(".ico").attr("class","glyphicon glyphicon-menu-down pull-right ico");
            $(this).parent().siblings('.menu').children('.menuTop').children(".ico").attr("class","glyphicon glyphicon-menu-up pull-right ico");
        }else{
            $(this).children(".ico").attr("class","glyphicon glyphicon-menu-down pull-right ico");
            $(this).parent().siblings('.menu').children('.menuTop').children(".ico").attr("class","glyphicon glyphicon-menu-up pull-right ico")
        }
        $(this).parent().siblings(".menu").children('.dataBar').slideUp();
        $(this).next('.dataBar').slideDown();
        $(this).parent().siblings('.menu').children('.menuTop').removeClass('active');
        $(this).addClass('active');
    });
}
function packToggle(){
    var tag = 0;
    $(".sidebar-toggle").on('click',function(event) {
        if(tag%2==0){
            $(".logo-big").hide();
            $(".logo-mini").show();
            $(".main-sidebar,.menu,.dataBar,.menuTop,.logo").width(60);
            $(".header-main").width($(window).width()-$(".logo").width());
            $(".menuName,.dataBar,.ico").hide();
            $(".main-wrapper").css("left",$(".main-sidebar").width());
            $(".menuTop").unbind('click');
            $(".menuTop.active").removeClass('active');
            $(".menu").bind({
                mouseenter: function(e) {
                    $(this).width(230).children(".menuName").show();
                    $(this).children(".menuName").width(230).show();
                    $(this).children(".dataBar").show();
                    $(this).children(".dataBar").children(".treeview").width(130).css("margin-left","60px");
                    $(this).children(".menuTop").width(230).children(".menuName").css("margin-left","40px").show();

                    $(this).siblings('.menu').width(60).children(".menuName").hide();
                    $(this).siblings('.menu').children(".menuName").width(60).hide();
                    $(this).siblings('.menu').children(".dataBar").hide();
                    $(this).siblings('.menu').children(".menuTop").width(60).children(".menuName").hide();
                    $(this).find(".dataBar.list-unstyled").css("position","absolute");
                    $(this).find(".dataBar.list-unstyled").css("z-index","-2");
                    $(".main-sidebar").css("z-index","1042");
                    $(".menuTop").css("border-radius","5px 5px 0 0");
                    $(this).children().find(".treeview").last().css("border-radius","0 0 5px");
                },
                mouseleave: function(e) {
                    $(this).width(60).children(".menuName").hide();
                    $(this).children(".menuName").width(60).hide();
                    $(this).children(".dataBar").hide();
                    $(this).children(".dataBar").children(".treeview").width(230).css("margin-left","0px");
                    $(this).children(".menuTop").width(60).children(".menuName").css("margin-left","0px").hide();
                    $(this).find(".dataBar.list-unstyled").css("position","static");
                    $(this).find(".dataBar.list-unstyled").css("z-index","auto");
                    $(".main-sidebar").css("z-index","auto");
                    $(".menuTop").css("border-radius","0");
                    $(this).children().find(".treeview").last().css("border-radius","0");
                }
            });

        }else{
            $(".logo-big,.ico").show();
            $(".logo-mini").hide();
            listSlider();
            $(".main-sidebar,.menu,.dataBar,.menuTop,.logo").width(230);
            $(".header-main").width($(window).width()-$(".logo").width());
            $(".menuName,.dataBar").show();
            $(".main-wrapper").css("left",$(".main-sidebar").width());
            $(".dataBar").hide();
            $(".treeview").width(190);

            $(".menuTop").removeClass('active');
            $(".ico").attr("class","glyphicon glyphicon-menu-up ico pull-right");
            $(".treeview.act").parent(".dataBar").show().siblings('.menuTop').addClass('active').children(".ico").attr("class","glyphicon glyphicon-menu-down ico pull-right");
            if(!$(".treeview").hasClass('act')){
                $(".menuTop").eq(0).addClass('active').next(".dataBar").show();
                $(".menuTop.active").children(".ico").attr("class","glyphicon glyphicon-menu-down pull-right ico");
            }
            $(".menu").unbind("mouseenter").unbind("mouseleave");
        }
        console.log(tag);
        tag++;
    });

}
function loadHtml(){
    $(".treeview").on("click",function(){
        $(this).siblings().removeClass('act');
        $(this).parent().parent(".menu").siblings().children(".dataBar").children(".treeview").removeClass('act');
        $(this).addClass('act');
        $(".main-wrapper").empty();
        var path = $(this).attr("data");
        var tps = $("<div class='tps'><img src='./images/load.gif' /></div>");

        //加载中动画...
        $(".main-wrapper").append(tps);
        $(".tps").slideDown('slow', function() {
            addLoad();
        });
        //加载页面
        function addLoad(){
            $(".main-wrapper").load( path , {
            param1: "value1", param2: "value2" },
                function(){
                $(".tps").hide('slow');
            });
        };

    });

}
