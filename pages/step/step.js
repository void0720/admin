//步骤条插件：
// Author:wangyajun
// Date:2017.5.11

/**======================================================================================================
一、初始化(可以链式调用)
    $(selector).loadSteps({
        state:false,    //设置为true时，请为steps的state赋值(false时无效)
        steps:[{
            title:'标题',
            // state:'2017-05-12 08:56',//在上级state为true请给本字段设置值
            description:'相关描述文字相关描述文字'
        },{
            title:'标题',
            // state:'2017-05-13 16:24',
            description:'相关描述文字相关描述文字'
        }]
    }).setStep(2);
======================================================================================================
二、设置步骤:
    $(selector).setStep(1);
    参数:[number]
======================================================================================================
三、垂直方向:
    加上class：ad-steps-vertical即可;
    <div class="ad-steps2 ad-steps-vertical"></div>
======================================================================================================
**/
;(function($) {

    $.fn.extend({

        loadSteps:function(opt){

            var Defaults = {
                state:false,
                steps:[{
                    title:'标题',
                    // state:'2017-05-12 08:56',
                    description:'相关描述文字相关描述文字'
                },{
                    title:'标题',
                    // state:'2017-05-13 16:24',
                    description:'相关描述文字相关描述文字'
                }]
            },
                opts = $.extend(true, {}, Defaults, opt);

            if(opts.steps && opts.steps.length>0){

                var stepHtml,
                    _this = $(this),
                    vertical = _this.hasClass('ad-steps-vertical'),
                    verticalStr = '<div class="ad-step-head"></div><div class="ad-step-cont"></div>',
                    horizontalStr = '<div class="ad-step-head"></div><div style="clear:both"></div><div class="ad-step-cont"></div>';

                vertical?stepHtml=verticalStr: stepHtml=horizontalStr;
                _this.append(stepHtml);

                var $adStepHead = _this.find($('.ad-step-head')),
                    $adStepCont = _this.find($('.ad-step-cont')),
                    $line = '<div class="ad-step-line"></div>',
                    $cont = '<div class="ad-step-log"></div>',
                    $item = '<div class="ad-step-item"></div>',
                    $title = '<div class="ad-step-title"></div>',
                    $description = '<div class="ad-step-description"></div>',
                    $clear = '<div style="clear:both"></div>';

                $adStepHead.append($line);
                if(vertical) _this.find($('.ad-step-line')).eq(0).css('marginTop',0);

                $.each(opts.steps, function(i, val) {

                    $adStepHead.append($cont);
                    $adStepHead.append($line);
                    $adStepCont.append($item);

                    var _item = _this.find($('.ad-step-item')).eq(i);
                    _item.append($title);
                    _item.append($description);

                    var LogLength = opts.steps.length-1,
                        $state =  _this.find($('.ad-step-stateBar'));
                        $adStepTitle = _this.find($('.ad-step-title')),
                        $adStepLog = _this.find($('.ad-step-log')),
                        $adStepDescription = _this.find($('.ad-step-description'));

                    $adStepLog.eq(i).text(i+1);

                    opts.steps[i].title?$adStepTitle.eq(i).text(opts.steps[i].title):$adStepTitle.eq(i).text('');
                    opts.steps[i].description?$adStepDescription.eq(i).text(opts.steps[i].description):$adStepDescription.eq(i).text('');

                });
                _this.find($('.ad-step-log')).last().text('√')

                //水平方向时 上方的状态栏
                if (opts.state) {
                    var logBar = _this.find('.ad-step-log'),
                        stateBar = '<div class="ad-step-stateBar"></div>';

                    logBar.append(stateBar);
                    var $stateBar = _this.find('.ad-step-stateBar');

                    $stateBar.each(function(index, el) {
                        if(opts.steps[index].state)  $stateBar.eq(index).text(opts.steps[index].state);
                    });
                    if (vertical) _this.addClass('vertical');
                    if (!vertical) _this.addClass('ad-steps-horizontal horizontal');

                }

                $adStepHead.append($clear);
                $adStepCont.append($clear);
                _this.append($clear);

            }

            return _this;
        },
        setStep:function(step){
            var _this = $(this);

            if(step && step>0){
                var $_item = _this.find('.ad-step-item'),
                    $unFinish = _this.find($('.ad-step-finish')),
                    $finishLine = _this.find($('.ad-step-line')),
                    $finishLog = $finishLine.siblings('.ad-step-log'),
                    $stateBar = _this.find('.ad-step-stateBar');

                    //多次调用setStep 重置
                    if($unFinish) $unFinish.removeClass('ad-step-finish');
                    $_item.removeClass('ad-step-finish-item ad-step-active');
                    $finishLog.removeClass('ad-step-complate');
                    $stateBar.removeClass('ad-step-finish-item ad-step-active');

                    $finishLog.each(function(i, el) {
                        if (step>i) {
                            $finishLine.eq(i).addClass('ad-step-finish');
                            $finishLog.eq(i).addClass('ad-step-finish');
                            $_item.eq(i).addClass('ad-step-finish-item');
                            $stateBar.eq(i).addClass('ad-step-finish-item');
                            $finishLine.eq(step+1).removeClass('ad-step-complate');
                        }
                    });

                var finishLength = _this.find($('.ad-step-finish')).length/2,
                    maxLength = _this.find($('.ad-step-head')).children().length/2-1;
                if(finishLength==maxLength) {
                    $finishLine.addClass('ad-step-finish').eq(maxLength).addClass('ad-step-complate');
                    _this.find('.ad-step-log.ad-step-finish').eq(maxLength-1).addClass('ad-step-complate');
                    $_item.eq(maxLength-1).addClass('ad-step-active');
                    $stateBar.eq(maxLength-1).addClass('ad-step-active');
                }
            }
            return _this;
        },
        getStep:function(){
            var _this = this,
                step = _this.find($('.ad-step-log.ad-step-finish')).length;
            _this.step = step;
            return step;
        },
        nextStep:function(){
            var _this = this;
                step = _this.getStep();
            _this.setStep(step+=1);
            return _this;
        },
        prevStep:function(){
            var _this = this;
                step = _this.getStep();
            _this.setStep(step-=1);
            return _this;
        }
    });

})(jQuery);
