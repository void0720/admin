/**
*   author: wangyajun
*   文件树插件 2017-04-16
**/
;(function($,window,document,undefined){
    //定义MyPlugin对象
    var MyPlugin = function(el,opt){
        //设置参数
        //定义变量
        //定义私有方法

        
    }
    //定义MyPlugin对象的方法
    MyPlugin.prototype = {
        init:function(){
            //调用私有方法
            //处理DOM
        }
    }
    //定义插件myplugin，在插件中使用MyPlugin对象
    $.fn.myplugin = function(options){
        //创建MyPlugin的实体
        myplug = new MyPlugin(this,options);
        //调用其方法
        return myplug.init();
    }
})($,window,document);
