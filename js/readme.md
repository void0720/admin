一、简单：
    $.extend({
        printTime: function(){
            var now = new Date(),
                y = now.getFullYear(),
                m = now.getMonth()+1,
                d = now.getDate();
            console.log(y +'-'+ m +'-'+ d);
        }
    });
    /*调用*/
    $.printTime();

二、微复杂
    关于$.extend()，jQuery的扩展方法：
    extend扩展方法的原型：
    extend(dest,src1,src2,src3,...);
    它的含义是将src1,src2,src3,...合并到dest中，返回值为合并后的dest，由此可见通过合并后，dest的结构会被修改了，如果不希望被修改，则可以如下使用：

    var defaults = {name1:'content1',name2:'content2'}
    var options = {name1:'Jone'}
    var settings = $.extend({},defaults,options);
    /*结果*/
    //settings = {name1:'Jone',name2:'content2'}
    这个方法一般用来在编写插件是用自定义插件参数去覆盖插件的默认参数

    省略dest参数$.extend(src)
    该方法就是将src合并到jQuery的全局对象中，如下例子，就是将hello方法合并到jQuery的全局对象中

    $.extend({
        hello:function(){
            alert('hello!');
        }
    });

三、通过$.fn 向jQuery添加新的方法(插件开发)
    基本方法$.fn.extend(obj) （为什么这里是$.fn.extend()而不是$.fn呢） 首先先来看看$.fn是什么意思

    jQuery.fn = jQuery.prototype = {
        init:function(selector,context){...};
    };
    可以发现，原来$.fn = $.prototype,那么$.fn.extend(obj)就是对$.prototype进行扩展，就是为jQuery类添加一个“成员函数”，jQuery类的实例可以使用这个“成员函数”。$.extend()的调用并不会把方法扩展到对象的实例上，或者说根本不需要实例化一个jQuery对象来调用$.extend()的方法；而$.fn.extend()的调用把方法扩展到了对象的prototype上，所以实例化一个jQuery对象时，它就具有了这些方法，这是很重要的。这就是插件机制了

    $.fn.extend(myplugin) 等价于 $.prototype.extend(myplugin) 等价于$.fn.myplugin
    编写一个简单的插件就是往$.fn添加一个方法（myplugin），然后插件代码在里面展开，然后通过$(selector).myplugin()调用该插件里面的方法,如下面的例子

    /*改变<p>标签文本的颜色，其他不受影响*/
    <body>
        <p>这是p标签，文本的颜色由黑色变为蓝色</p>
        <div>这是div标签，文本的颜色没有变化</div>
        <script type="text/javascript" src="js/jquery-3.1.0.min.js"></script>
        <script type="text/javascript">
            $.fn.myPlugin = function(){
                this.css({color:'blue'});// this指调用该插件的元素，这里是指$('p')
            }
            $('p').myPlugin();
        </script>
    </body>
    这里要特别注意的是this，在这里指的是调用该插件的元素，但是在别的地方又指代不同时又需要用jQuery重新包装才能调用，需要理解清楚。

# 链式调用

    在插件代码里是处理每个具体的元素而不是对一个集合进行处理，由上面已经知道this指代jQuery选择器返回的集合，那么通过调用jQuery的.each()方法就可以处理集合中的每个元素了，需要注意的是，此时在each方法内部，this指代普通的DOM元素，需要用$(this)来调用jQuery方法
    jQuery有一个优雅的特性就是支持链式调用，而为了是编写的插件也支持链式调用，只需return this.each(...);把jQuery对象返回出来，就可以继续调用其他插件来处理这个jQuery对象。
    <body>
        <p>这是p标签1，我的编号是</p>
        <p>这是p标签2，我的编号是</p>
        <p>这是p标签3，我的编号是</p>
        <script type="text/javascript" src="js/jquery-3.1.0.min.js"></script>
        <script type="text/javascript">
            $.fn.myPlugin = function(){
                var n=1;
                retrun this.each(function(){
                    $(this).append(n);
                    n++;
                });
            }
            $('p').myPlugin();
        </script>
    </body>

    让插件接收参数

到此已经可以编写一个简单的插件了，但是一个强大的插件应该是可以让使用者随意定制的，所以需要提供合适的参数，如果使用者没有提供参数，则使用插件默认的参数。在处理插件参数的接收上，用到了前面说到的$.extend()方法。

# 面向对象的插件开发

支持链式调用，支持自定义参数，就可以写出一个健壮灵活的插件了，但是如果要编写一个代码量大的复杂插件，如何组织代码就成了一个需要面临的问题，可能会需要一个方法的时候就去定义一个function，当需要另一个方法时再随便在代码中一个地方定义一个function，同时也留下了毫无规则的散落在代码各处的变量，这样的结果是代码不方便维护，也不够清晰，甚至会出现变量污染的结果。

//定义MyPlugin对象
var MyPlugin = function(ele,opt){
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
从上面的结构可以很清晰地看到，将重要的变量定义到对象的属性上，在对象中使用变量定义私有方法，在对象的方法中可以调用私有方法从而访问变量，当需要加入新功能新方法是，只需要向对象添加新的变量和私有方法即可，然后在对象的方法中访问调用私有方法，再通过插件里实例化的对象调用该方法即可。这样的好处有：

代码结构清晰，方便管理、维护
不会影响到外部命名空间，因为变量和方法都是在对象内部
对代码的改动并不会影响插件的调用，让$.fn可以专注于插件的调用

自调用匿名函数(闭包)
在代码量大的情况下，很容易在全局范围内定义了一些变量，最后很难维护，甚至会跟别人写的代码有冲突，所以一般都不会将变量定义全局的，另外一个方法就是始终用自调匿名函数把代码包裹起来，就可以避免冲突的问题了

自调用匿名函数指(function{....})();
(function{....})();是一个表达式，所以当代码执行到这里的时候，js回去对它求解得到返回值，由于返回值是一个函数，故遇();时，便会被执行。然而function{..}();在js预编译的时候会解释函数声明function{...}，当代码执行到这里的时候，js会跳过function{..}，试图去执行();故而报错！
函数转换为表达式的方法并不一定要靠分组操作符(),可以用!操作符，~操作符...
为了防止引入插件报错，应该在闭包前面加一个分号，即;(function{....})();这样做为了避免因为其他代码没有以分号结尾，引入插件后用来冲到自调匿名函数的第一对括号与别人定义的函数相连，无法正常解析，所以一个好习惯是始终在开头加上分号";"
下面是一个图片轮播的例子：
;(function($,window,document,undefined){
    /*****定义Banner的构造函数******/
    //将变量定义到对象的属性上，函数变成对象的方法，使用时通过对象获取
    var Banner = function(ele,opt){
        this.$element = ele,           //获取到的jQuery对象console.log(this);
        //设置默认参数
        this.defaults = {
            'auto': true,            //是否自动播放，默认自动播放  
            'navActCls': 'act',        //当前状态的class
            'imgBoxCls': 'imgBox',    //图片列表的class
            'imgNav': 'nav',           //图片导航的class
            'pageBtn': 'pageBtn',      //prev、next按钮的class
            'prevPage': 'prev',        //prev按钮的class
            'nextPage': 'next',        //next按钮的class
            'hideCls': 'hide'          //隐藏的class   
        },
        this.options = $.extend({}, this.defaults, opt);
        //////定义全局变量
        var _ = this,
            imgWidth  = this.$element.width(),           //图片的宽度
            $imgBox = this.$element.children('.'+this.options.imgBoxCls),  //图片列表
            imgBoxWidth = $imgBox.width(),               //图片列表的宽度
            $navBox = this.$element.children('.'+this.options.imgNav), // 导航
            $pageBtn = this.$element.find('.'+this.options.pageBtn),   // prev、next按钮
            slideTarget = 0,                             //轮播动画的目标值
            timer = null;                                 //计时器
            navIndex = 0;                                 //当前图片的号数
        ///////定义方法
        //自动轮播
        this.auto = function(){
            if(_.options.auto===false){
                return false;
            }
            clearInterval(timer);
            timer = setInterval(function(){
                _.next();
            },4000);
        }
        //停止自动轮播
        this.stop = function(){
            clearInterval(timer);
        }
        //下一页
        this.next = function(){
            slideTarget -= imgWidth;
            navIndex = -slideTarget/imgWidth;
            if(slideTarget<0-imgBoxWidth){
                $imgBox.children(':last').remove();
                $imgBox.width(imgBoxWidth);
                $imgBox.css({left:0});
                slideTarget = 0-imgWidth;
                navIndex = -slideTarget/imgWidth;
            }
            if(slideTarget===0-imgBoxWidth){
                //复制第一张图片追加到图片列表末尾，实现无缝轮播
                $imgBox.width(function(){
                    return imgBoxWidth+imgWidth;
                });
                $imgBox.children(':first').clone().appendTo('.'+_.options.imgBoxCls);
                navIndex = 0;
            }
            $imgBox.animate({left:slideTarget}); //向左移动值为slideTarget的距离
            $navBox.children().removeClass(_.options.navActCls);
            $navBox.children(':eq('+navIndex+')').addClass(_.options.navActCls);
        }
        //上一页
        this.prev = function(){
            var $cloneImgBox,      // 复制的图片列表
                boolClone;         // 是否有克隆的图片列表
            if(slideTarget>0){
                $imgBox.css({left:imgWidth-imgBoxWidth});
                _.$element.children(':first').remove();
                slideTarget = imgWidth - imgBoxWidth;
                navIndex = $imgBox.children(':last').index();
                boolClone = false;
            }
            if(slideTarget===0){
                //复制图片列表放到原来的图片列表前面
                $cloneImgBox = $imgBox.clone();
                boolClone = true;   
                $cloneImgBox.insertBefore('.'+_.options.imgBoxCls);
                $cloneImgBox.css({left:0-imgBoxWidth});
                navIndex = $imgBox.children(':last').index() + 1;
            }
            slideTarget += imgWidth;
            navIndex = -slideTarget/imgWidth;
            $imgBox.animate({left:slideTarget});
            //boolClone=true时在图片列表向右移动时克隆的图片列表同时向右移动，实现无缝轮播
            if(boolClone){
                $cloneImgBox.animate({left:imgWidth-imgBoxWidth});
            }
            $navBox.children().removeClass(_.options.navActCls);
            $navBox.children(':eq('+navIndex+')').addClass(_.options.navActCls);
        }
        //定位图片
        this.position = function(index){
            navIndex = index;
            var actIndex = $('.'+_.options.imgNav+' '+'.'+_.options.navActCls).index();
            if(slideTarget-imgWidth<0-imgBoxWidth){
                $imgBox.children(':last').remove();
                $imgBox.width(imgBoxWidth);
                $imgBox.css({left:0});
                slideTarget = 0;
            }
            if(actIndex===$navBox.children(':last').index() && navIndex===0){
                _.next();
            }
            else{
                if(navIndex>actIndex){
                    slideTarget -= imgWidth*(navIndex-actIndex);
                }else if(navIndex<actIndex){
                    slideTarget += imgWidth*(actIndex-navIndex);
                } else{
                    return false;
                }
                $('.'+_.options.imgNav).children().removeClass(_.options.navActCls);
                $('.'+_.options.imgNav).children(':eq('+navIndex+')').addClass(_.options.navActCls);
                $imgBox.animate({left:slideTarget});
            }

        }
    }

    /// 定义Banner的方法
    Banner.prototype = {
        init:function(){
            var _ = this;
            //自动播放
            _.auto();
            //鼠标移动到图片中显示向左向右按钮
            _.$element.hover(
                function(){
                    $('.'+_.options.pageBtn).removeClass(_.options.hideCls);
                    _.stop();
                },
                function(){
                    $('.'+_.options.pageBtn).addClass(_.options.hideCls);
                    _.auto();
                }
            );
            //点击next按钮停止自动播放然后显示下一页
            $('.'+_.options.nextPage).click(function(){
                _.next();
            });
            //点击prev按钮停止自动播放然后显示上一页
            $('.'+_.options.prevPage).click(function(){
                _.prev();
            });
            //点击导航定位到具体的图片
            $('.'+_.options.imgNav).children().click(function(){
                var index = $(this).index();
                _.position(index);
            });
        }
    }
    /******$.fn里面应专注于插件的调用******/
    //在插件中使用Banner对象
    $.fn.banner = function(options){
        //创建Banner的实体
        ban = new Banner(this,options);
        //调用其方法
        return ban.init();
    }
})(jQuery,window,document);
